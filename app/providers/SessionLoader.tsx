'use client'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/components/context/Store'

function SessionLoader({ children }: { children: ReactNode }) {
  const { status, data: session } = useSession()
  const { setLoginState } = useAuthStore()
  const isLogin = !!session && status === 'authenticated'

  useEffect(() => {
    setLoginState(isLogin)
  }, [isLogin, setLoginState])

  return <>{children}</>
}

export default SessionLoader
