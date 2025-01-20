import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/connecter'
import bcrypt from 'bcryptjs'
import User from '@/app/lib/models/User'
import { promises as fs } from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authoptions'

// 이미지 업로드 경로 설정
const uploadDir = path.join(process.cwd(), 'public/upload')

export async function POST(req: NextRequest) {
  await connectDB()
  const formData = await req.formData()
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string
  const profileImage = formData.get('profileImage') as File | null

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
    const fileName = `${email}_${Date.now()}_${profileImage.name}`
    const filePath = path.join(uploadDir, fileName)

    // 업로드 폴더 생성 (존재하지 않으면)
    await fs.mkdir(uploadDir, { recursive: true })

    // 파일 저장
    const buffer = Buffer.from(await profileImage.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    imagePath = `/upload/${fileName}` // 이미지 URL 경로
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
  const users = await User.find({}).lean()
  return NextResponse.json(users, { status: 200 })
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()

    // 요청 데이터 처리
    const formData = await req.formData()
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const password = formData.get('password') as string
    const profileImage = formData.get('profileImage') as File | null

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10)

    // 프로필 이미지 저장
    let imagePath = null
    if (profileImage) {
      const fileName = `${email}_${Date.now()}_${profileImage.name}`
      const filePath = path.join(uploadDir, fileName)

      // 업로드 폴더 생성 (존재하지 않으면)
      await fs.mkdir(uploadDir, { recursive: true })

      // 파일 저장
      const buffer = Buffer.from(await profileImage.arrayBuffer())
      await fs.writeFile(filePath, buffer)

      imagePath = `/upload/${fileName}` // 이미지 URL 경로
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

    const session = await getServerSession(authOptions)
    if (session && session.user && session.user.email === email) {
      session.user.name = name
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { message: 'Internal Server Error', error: (error as Error).message },
      { status: 500 },
    )
  }
}
