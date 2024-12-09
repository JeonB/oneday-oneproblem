'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import classes from './header.module.css'
import { useUser } from '@/app/utils/auth'
interface ClientHeaderProps {
  children: React.ReactNode
  user: { name: string } | null
}

export default function ClientHeader({ children, user }: ClientHeaderProps) {
  const router = useRouter()
  // const user = useUser()
  const onLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    alert('로그아웃 되었습니다.')
    // window.location.reload()
    router.push('/')
  }

  return (
    <nav className={classes.nav}>
      {children}

      <ul className={classes.ul}>
        {user ? (
          <>
            <li className={classes.li}>
              <Link className={classes.a} href="/">
                {user.name}님 환영합니다.
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
