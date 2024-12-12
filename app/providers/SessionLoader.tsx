'use client'
import { useStore } from '@/components/context/StoreContext'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/components/context/Store'

function SessionLoader({ children }: { children: ReactNode }) {
  // const { status, data: session } = useSession()
  // const { loginState, setLoginState } = useStore()
  // const { loginState, setLoginState } = useAuthStore()
  // const isLogin = !!session && status === 'authenticated'
  // const token = isLogin ? session.accessToken : ''

  // useEffect(() => {
  //   // setToken(token)
  //   setLoginState(isLogin)
  //   console.log(isLogin)
  //   console.log(session)
  // }, [isLogin, loginState])

  return <>{children}</>
}

export default SessionLoader
