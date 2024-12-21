import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/connecter'
import bcrypt from 'bcryptjs'
import User from '@/app/lib/models/User'

export async function POST(req: NextRequest) {
  await connectDB()
  const { name, email, password } = await req.json()

  const userExists = await User.findOne({ email })
  if (userExists) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 },
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    name,
    email,
    password: hashedPassword,
  }
  User.insertMany(newUser)

  return NextResponse.json({ status: 201 })
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: 'POST' } })
}
