import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { promises as fs } from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authoptions'
import { z } from 'zod'
import { getClientIdFromRequest, rateLimit } from '@/app/lib/rateLimit'
import { logger, createRequestContext } from '@/lib/logger'
import { userQueries, withPerformanceMonitoring } from '@/lib/db'
import { withEnhancedPerformanceMonitoring } from '@/lib/performance'

// 이미지 업로드 경로 설정
const uploadDir = path.join(process.cwd(), 'public/upload')

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp'])

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9_.-]/g, '_')

export async function POST(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('User registration request received', context)

  const id = getClientIdFromRequest(req)
  const rl = rateLimit({ id, capacity: 5, refillPerSec: 1 })
  if (!rl.allowed) {
    logger.warn('Rate limit exceeded for user registration', {
      ...context,
      clientId: id,
    })
    return NextResponse.json(
      { message: 'Too Many Requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  const formData = await req.formData()
  const email = (formData.get('email') as string) || ''
  const name = (formData.get('name') as string) || ''
  const password = (formData.get('password') as string) || ''
  const profileImage = formData.get('profileImage') as File | null

  const BodySchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6),
  })
  const parsed = BodySchema.safeParse({ email, name, password })
  if (!parsed.success) {
    logger.warn('Invalid user registration payload', { ...context, email })
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
  }

  try {
    const userExists = await withEnhancedPerformanceMonitoring(
      'checkUserExists',
      () => userQueries.findByEmailWithPassword(email),
      { clientId: id },
    )

    if (userExists) {
      logger.warn('User already exists during registration', {
        ...context,
        email,
      })
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let imagePath = null
    if (profileImage) {
      if (!ALLOWED_MIME.has(profileImage.type)) {
        logger.warn('Unsupported file type in user registration', {
          ...context,
          fileType: profileImage.type,
        })
        return NextResponse.json(
          { message: 'Unsupported file type' },
          { status: 400 },
        )
      }
      if (profileImage.size > MAX_UPLOAD_BYTES) {
        logger.warn('File too large in user registration', {
          ...context,
          fileSize: profileImage.size,
        })
        return NextResponse.json({ message: 'File too large' }, { status: 413 })
      }
      const safeName = sanitizeFileName(profileImage.name)
      const fileName = `${email}_${Date.now()}_${safeName}`
      const filePath = path.join(uploadDir, fileName)

      // 업로드 폴더 생성 (존재하지 않으면)
      await fs.mkdir(uploadDir, { recursive: true })

      // 파일 저장
      const buffer = Buffer.from(await profileImage.arrayBuffer())
      await fs.writeFile(filePath, buffer)

      imagePath = `/upload/${fileName}`
    }

    const newUser = {
      name,
      email,
      password: hashedPassword,
      profileImage: imagePath,
    }

    await withEnhancedPerformanceMonitoring(
      'createUser',
      () => userQueries.createUser(newUser),
      { clientId: id, metadata: { hasProfileImage: !!profileImage } },
    )

    logger.info('User registered successfully', { ...context, email })
    return NextResponse.json({ status: 201 })
  } catch (error) {
    logger.error('Error during user registration', error as Error, context)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: 'POST' } })
}

export async function GET(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('User profile request received', context)

  const session = await getServerSession(authOptions)
  if (!session) {
    logger.warn('Unauthorized user profile request', context)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const me = await withEnhancedPerformanceMonitoring(
      'getUserProfile',
      () => userQueries.findByEmail(session.user?.email || ''),
      { userId: session.user?.id },
    )

    if (!me) {
      logger.error('User profile not found', undefined, {
        ...context,
        email: session.user?.email,
      })
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    logger.info('User profile retrieved successfully', {
      ...context,
      userId: session.user?.id,
    })
    return NextResponse.json(me, { status: 200 })
  } catch (error) {
    logger.error('Error retrieving user profile', error as Error, context)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('User profile update request received', context)

  try {
    const id = getClientIdFromRequest(req)
    const rl = rateLimit({ id, capacity: 10, refillPerSec: 2 })
    if (!rl.allowed) {
      logger.warn('Rate limit exceeded for user profile update', {
        ...context,
        clientId: id,
      })
      return NextResponse.json(
        { message: 'Too Many Requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
    }

    // 요청 데이터 처리
    const formData = await req.formData()
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const password = formData.get('password') as string
    const profileImage = formData.get('profileImage') as File | null

    const session = await getServerSession(authOptions)
    if (!session || session.user?.email !== email) {
      logger.warn('Unauthorized user profile update attempt', {
        ...context,
        email,
      })
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const BodySchema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
      password: z.string().min(6),
    })
    const parsed = BodySchema.safeParse({ email, name, password })
    if (!parsed.success) {
      logger.warn('Invalid user profile update payload', { ...context, email })
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10)

    // 프로필 이미지 저장
    let imagePath = null
    if (profileImage) {
      if (!ALLOWED_MIME.has(profileImage.type)) {
        logger.warn('Unsupported file type in profile update', {
          ...context,
          fileType: profileImage.type,
        })
        return NextResponse.json(
          { message: 'Unsupported file type' },
          { status: 400 },
        )
      }
      if (profileImage.size > MAX_UPLOAD_BYTES) {
        logger.warn('File too large in profile update', {
          ...context,
          fileSize: profileImage.size,
        })
        return NextResponse.json({ message: 'File too large' }, { status: 413 })
      }
      const safeName = sanitizeFileName(profileImage.name)
      const fileName = `${email}_${Date.now()}_${safeName}`
      const filePath = path.join(uploadDir, fileName)

      // 업로드 폴더 생성 (존재하지 않으면)
      await fs.mkdir(uploadDir, { recursive: true })

      // 파일 저장
      const buffer = Buffer.from(await profileImage.arrayBuffer())
      await fs.writeFile(filePath, buffer)

      imagePath = `/upload/${fileName}`
    }

    // 사용자 데이터 업데이트
    const updateData: Record<string, any> = { name, password: hashedPassword }
    if (imagePath) {
      updateData.profileImage = imagePath
    }

    const user = await withEnhancedPerformanceMonitoring(
      'updateUserProfile',
      () => userQueries.updateUser(email, updateData),
      {
        userId: session.user?.id,
        clientId: id,
        metadata: { hasProfileImage: !!profileImage },
      },
    )

    if (!user) {
      logger.error('User not found during profile update', undefined, {
        ...context,
        email,
      })
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // 클라이언트에서 useSession().update(...)로 동기화 권장

    logger.info('User profile updated successfully', { ...context, email })
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    logger.error('Error updating user profile', error as Error, context)
    return NextResponse.json(
      { message: 'Internal Server Error', error: (error as Error).message },
      { status: 500 },
    )
  }
}
