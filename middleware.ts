import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value // 쿠키에서 토큰 추출
  if (!token) {
    // 토큰이 없으면 로그인 페이지로 리디렉션
    return NextResponse.redirect(new URL('/login', req.url))
  }
  const secretKey = process.env.JWT_SECRET?.trim()
  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined in the environment variables.')
  }
  try {
    // 토큰 검증
    const secret = new TextEncoder().encode(secretKey)
    const { payload } = await jwtVerify(token, secret)
    // req.headers.set('user', JSON.stringify(payload)) // 사용자 정보를 헤더에 추가
    return NextResponse.next()
  } catch (err) {
    console.error(err)
    // 토큰이 유효하지 않은 경우 로그인 페이지로 리디렉션
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/problem/:path*'],
}
