import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/connecter'
import bcrypt from 'bcryptjs'
import User from '@/app/lib/models/User'
import { promises as fs } from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authoptions'
import { z } from 'zod'
import { getClientIdFromRequest, rateLimit } from '@/app/lib/rateLimit'

// 이미지 업로드 경로 설정
const uploadDir = path.join(process.cwd(), 'public/upload')

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp'])

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9_.-]/g, '_')

export async function POST(req: NextRequest) {
  const id = getClientIdFromRequest(req)
  const rl = rateLimit({ id, capacity: 5, refillPerSec: 1 })
  if (!rl.allowed)
    return NextResponse.json(
      { message: 'Too Many Requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  await connectDB()
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
  if (!parsed.success)
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })

  const userExists = await User.findOne({ email })
  if (userExists) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 },
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  let imagePath = null
  if (profileImage) {
    if (!ALLOWED_MIME.has(profileImage.type)) {
      return NextResponse.json(
        { message: 'Unsupported file type' },
        { status: 400 },
      )
    }
    if (profileImage.size > MAX_UPLOAD_BYTES) {
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
  await User.insertMany(newUser)

  return NextResponse.json({ status: 201 })
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: 'POST' } })
}

export async function GET(req: NextRequest) {
  await connectDB()
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  // 최소한의 데이터만 반환 (자기 자신)
  const me = await User.findOne({ email: session.user?.email })
    .select('name email profileImage streak totalProblemsSolved lastSolvedDate')
    .lean()
  return NextResponse.json(me, { status: 200 })
}

export async function PUT(req: NextRequest) {
  try {
    const id = getClientIdFromRequest(req)
    const rl = rateLimit({ id, capacity: 10, refillPerSec: 2 })
    if (!rl.allowed)
      return NextResponse.json(
        { message: 'Too Many Requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
    await connectDB()

    // 요청 데이터 처리
    const formData = await req.formData()
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const password = formData.get('password') as string
    const profileImage = formData.get('profileImage') as File | null

    const session = await getServerSession(authOptions)
    if (!session || session.user?.email !== email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const BodySchema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
      password: z.string().min(6),
    })
    const parsed = BodySchema.safeParse({ email, name, password })
    if (!parsed.success)
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10)

    // 프로필 이미지 저장
    let imagePath = null
    if (profileImage) {
      if (!ALLOWED_MIME.has(profileImage.type)) {
        return NextResponse.json(
          { message: 'Unsupported file type' },
          { status: 400 },
        )
      }
      if (profileImage.size > MAX_UPLOAD_BYTES) {
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

    const user = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
    }).lean()

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // 클라이언트에서 useSession().update(...)로 동기화 권장

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { message: 'Internal Server Error', error: (error as Error).message },
      { status: 500 },
    )
  }
}
