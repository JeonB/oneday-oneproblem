import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '문제 페이지',
  description: '로그인 해야 문제 볼 수 있음!',
}

export default function ProblemLayout({
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
