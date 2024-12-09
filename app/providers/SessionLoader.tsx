'use client'
import { useStore } from '@/components/context/StoreContext'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

function SessionLoader({ children }: { children: ReactNode }) {
  const { status, data: session } = useSession()
  const { setLoginState } = useStore()

  const isLogin = !!session && status === 'authenticated'
  //   const token = isLogin ? session.accessToken : ''

  useEffect(() => {
    // setToken(token)
    setLoginState(isLogin)
  }, [isLogin])

  return <>{children}</>
}

export default SessionLoader
