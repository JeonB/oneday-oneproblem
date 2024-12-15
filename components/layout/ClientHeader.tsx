'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import classes from './header.module.css'
import { useUser } from '@/app/utils/auth'
import { signOut, useSession } from 'next-auth/react'
import { useStore } from '../context/StoreContext'
import { useAuthStore } from '@/components/context/Store'
import { useEffect, useState } from 'react'

interface ClientHeaderProps {
  children: React.ReactNode
  user: { name: string } | null
}
type sessionProps = {
  user: {
    name: string
    email: string
  }
}

export default function ClientHeader({ children, user }: ClientHeaderProps) {
  const router = useRouter()
  // const user = useUser()
  // const { loginState } = useStore()
  const { data: session, status } = useSession()
  const { loginState, setLoginState } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  const onLogout = async () => {
    await signOut({ callbackUrl: '/' })
    await fetch('/api/auth/logout', { method: 'POST' })
    setLoginState(false)
    alert('로그아웃 되었습니다.')
    router.push('/')
  }

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
    } else {
      setLoginState(!!session && status === 'authenticated')
      setIsLoading(false)
    }
  }, [session, status])

  if (isLoading) {
    return null
  }

  return (
    <nav className={classes.nav}>
      {children}

      <ul className={classes.ul}>
        {loginState ? (
          <>
            <li className={classes.li}>
              <Link className={classes.a} href="/">
                {session?.user?.email}님 환영합니다.
              </Link>
            </li>
            <li className={classes.li}>
              <Button variant="link" asChild onClick={onLogout}>
                <Link className={classes.a} href="/">
                  로그아웃
                </Link>
              </Button>
            </li>
          </>
        ) : (
          <li className={classes.li}>
            <Button variant="link" asChild>
              <Link className={classes.a} href="/login">
                로그인/회원가입
              </Link>
            </Button>
          </li>
        )}
      </ul>
    </nav>
  )
}
