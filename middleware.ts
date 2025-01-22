import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
export async function middleware(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === 'production'
  const tokenName = isProduction
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'
  const token = req.cookies.get(tokenName)?.value // 쿠키에서 토큰 추출
  if (!token) {
    console.log('No token found, redirecting to login page.')
    // 토큰이 없으면 로그인 페이지로 리디렉션
    return NextResponse.redirect(new URL('/login', req.url))
  }
  const secretKey = process.env.NEXTAUTH_SECRET?.trim()
  if (!secretKey) {
    throw new Error(
      'NEXTAUTH_SECRET is not defined in the environment variables.',
    )
  }
  try {
    const payload = getToken({ req, secret: secretKey })
    return NextResponse.next()
  } catch (err) {
    console.error('Invalid token:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  // matcher: ['/profile', '/problem/:path*'],
  matcher: [],
}
