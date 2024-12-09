import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value // 쿠키에서 토큰 추출

  if (!token) {
    // 토큰이 없으면 로그인 페이지로 리디렉션
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.headers.set('user', JSON.stringify(decoded)) // 사용자 정보를 헤더에 추가
    return NextResponse.next()
  } catch (err) {
    // 토큰이 유효하지 않은 경우 로그인 페이지로 리디렉션
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/problem/:path*'],
}
