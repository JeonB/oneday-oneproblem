import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/connecter'
import bcrypt from 'bcryptjs'
import User from '@/app/lib/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authoptions'

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

export async function GET(req: NextRequest) {
  await connectDB()
  const users = await User.find({}).lean()
  return NextResponse.json(users, { status: 200 })
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const { email, name, password } = await req.json()

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.findOneAndUpdate(
      { email },
      { name, password: hashedPassword },
      { new: true },
    ).lean()

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
