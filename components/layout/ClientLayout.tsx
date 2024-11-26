'use client'

import MobileHeader from '@/components/layout/mobile/MobileHeader'
import NavBar from '@/components/layout/NavBar'
import { useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const [isMobile, setIsMobile] = useState(false)

  // 클라이언트에서 화면 크기 변화 감지
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768) // 768px 이하를 모바일로 간주
    }

    // 처음 로드될 때와 창 크기 변경될 때 모바일 여부 판단
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <header
        style={{
          position: 'relative',
          top: 0,
          width: '100%',
          zIndex: 1000,
          backgroundColor: 'white',
        }}>
        {isMobile ? <MobileHeader /> : <NavBar />}
      </header>
      <main>{children}</main>
    </>
  )
}
