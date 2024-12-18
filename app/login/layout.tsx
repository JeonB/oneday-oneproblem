import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '1일 1문제 로그인',
  description: '로그인 해야 문제 볼 수 있음!',
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <main>{children}</main>
    </div>
  )
}
