'use client'
import React from 'react'
import { CodeProvider } from '@/components/context/CodeContext'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '1일 1문제 - 알고리즘 문제 풀이',
  description: '하루에 한 문제씩 알고리즘 문제를 풀어보세요!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <CodeProvider>{children}</CodeProvider>
}
