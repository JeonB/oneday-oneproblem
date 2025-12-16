import React from 'react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { OneDayProvider } from '@/components/context/StoreContext'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import NextAuthSessionProvider from './(auth)/providers/SessionProvider'
import SessionLoader from './(auth)/providers/SessionLoader'
import { ToastProvider } from '@/components/ui/toast/ToastProvider'

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

const getMetadataBase = (): URL => {
  if (process.env.NODE_ENV !== 'production') {
    const devUrl = process.env.DEV_URL
    return devUrl ? new URL(devUrl) : new URL('http://localhost:3000')
  } else {
    const prodUrl = process.env.PRODUCTION_URL
    // 프로덕션 환경에서는 환경 변수가 필수이지만, 빌드 시점에는 기본값 제공
    return prodUrl ? new URL(prodUrl) : new URL('https://oneday-oneproblem.com')
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
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
              <ToastProvider>
                <div className="container">
                  <header>
                    <Header />
                  </header>
                  <div className="main-content">
                    <main>{children}</main>
                  </div>
                  <footer>
                    <Footer />
                  </footer>
                </div>
              </ToastProvider>
            </SessionLoader>
          </OneDayProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
