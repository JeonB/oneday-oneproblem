'use client'
import React from 'react'
import { CodeProvider } from '@/components/context/CodeContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <CodeProvider>{children}</CodeProvider>
}
