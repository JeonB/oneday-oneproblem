'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import classes from './header.module.css'
import { useUser } from '@/app/utils/auth'
import { signOut, useSession } from 'next-auth/react'
import { useStore } from '../context/StoreContext'

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
  const { loginState } = useStore()
  const onLogout = async () => {
    await signOut({ redirect: false })
    await fetch('/api/auth/logout', { method: 'POST' })
    alert('로그아웃 되었습니다.')
    router.push('/')
  }

  const { data: session, status } = useSession()
  console.log('세션 상태', status)
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
            <Button variant="link" asChild onClick={onLogout}>
              <li className={classes.li}>
                <Link className={classes.a} href="/">
                  로그아웃
                </Link>
              </li>
            </Button>
          </>
        ) : (
          <Button variant="link" asChild>
            <li className={classes.li}>
              <Link className={classes.a} href="/login">
                로그인/회원가입
              </Link>
            </li>
          </Button>
        )}
      </ul>
    </nav>
  )
}
