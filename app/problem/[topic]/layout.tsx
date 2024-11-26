'use client'
import React from 'react'
import { CodeProvider } from '@/components/context/CodeContext'
import { Metadata } from 'next'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <CodeProvider>{children}</CodeProvider>
}
