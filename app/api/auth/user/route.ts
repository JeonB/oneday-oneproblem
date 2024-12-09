import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

type UserToken = {
  name: string
  email: string
  iat: number
  exp: number
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 402 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserToken
    const user = { name: decoded.name, email: decoded.email }
    return NextResponse.json(user, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
