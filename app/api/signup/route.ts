import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/utils/connecter'
import bcrypt from 'bcryptjs'
import User from '@/app/utils/models/User'
import { generateToken } from '../auth/login/route'

export async function POST(req: NextRequest) {
  await connectDB()
  const { name, email, password } = await req.json()

  // Check if user already exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 },
    )
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const newUser = { name, email, password: hashedPassword }
  User.insertMany(newUser)

  // Generate JWT
  const token = generateToken({ name, email })

  return NextResponse.json({ token }, { status: 201 })
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: 'POST' } })
}
