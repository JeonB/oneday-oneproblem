import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'
import { Footer } from '@/components/layout/Footer'

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
  title: '1일 1문제',
  description: '하루에 한 문제씩 알고리즘 문제를 풀어보세요!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="container">
          <div className="main-content">
            <ClientLayout>{children}</ClientLayout>
          </div>

          <Footer />
        </div>
      </body>
    </html>
  )
}
