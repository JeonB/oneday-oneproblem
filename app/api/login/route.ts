import User from '@/app/utils/models/User'
import { connectDB } from '@/app/utils/connecter'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  await connectDB()

  const { email, password } = await req.json()
  const user = await User.findOne({ email })

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

  const token = jwt.sign(
    { email, name: user.name },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1h',
    },
  )

  return NextResponse.json({ token }, { status: 200 })
}
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: 'POST' } })
}
