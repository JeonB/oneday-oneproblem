import { NextResponse } from 'next/server'

export async function POST() {
  // 쿠키 만료 설정
  const response = NextResponse.json(
    { message: '로그아웃 되었습니다.' },
    { status: 200 },
  )

  // 토큰 쿠키 삭제 (Max-Age를 0으로 설정)
  response.cookies.set('token', '', {
    path: '/', // 루트 경로
    maxAge: 0, // 즉시 만료
    httpOnly: true, // 클라이언트에서 접근 불가
    secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송 (프로덕션 환경에서 활성화)
  })

  return response
}
