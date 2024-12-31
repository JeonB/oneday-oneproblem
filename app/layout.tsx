import React from 'react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { OneDayProvider } from '@/components/context/StoreContext'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import NextAuthSessionProvider from './providers/SessionProvider'
import SessionLoader from './providers/SessionLoader'
import { Toaster } from '@/components/ui/toaster'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: {
    template: '%s | 1일 1문제',
    default: '1일 1문제',
  },
  description: '하루에 한 문제씩 알고리즘 문제를 풀어보세요!',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextAuthSessionProvider>
          <OneDayProvider>
            <SessionLoader>
              <div className="container">
                <header>
                  <Header />
                </header>
                <div className="main-content">
                  <main>{children}</main>
                  <Toaster />
                </div>
                <footer>
                  <Footer />
                </footer>
              </div>
            </SessionLoader>
          </OneDayProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
