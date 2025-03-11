'use client'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/components/context/StoreContext'

function SessionLoader({ children }: { children: ReactNode }) {
  const { status, data: session } = useSession()
  const setLoginState = useAuthStore(state => state.setLoginState)
  const isLogin = !!session && status === 'authenticated'

  useEffect(() => {
    setLoginState(isLogin)
  }, [isLogin, setLoginState])

  return <>{children}</>
}

export default SessionLoader
