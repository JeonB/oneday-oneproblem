import User, { UserProps } from '@/app/utils/models/User'
import { connectDB } from '@/app/utils/connecter'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  await connectDB()

  const { email, password } = await req.json()
  const user = (await User.findOne({ email })) as UserProps | null

  if (!user) {
    return NextResponse.json(
      { message: '아이디 또는 비밀번호가 일치하지 않습니다' },
      { status: 401 },
    )
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return NextResponse.json(
      { message: '아이디 또는 비밀번호가 일치하지 않습니다' },
      { status: 401 },
    )
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  // Generate JWT
  const token = generateToken({ name: user.name, email: user.email })

  // Set cookie with HttpOnly and Secure attributes
  const response = NextResponse.json(
    { message: '로그인 성공' },
    { status: 200 },
  )
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  })

  return response
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: 'POST' } })
}

export function generateToken(payload: { name: string; email: string }) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
}
