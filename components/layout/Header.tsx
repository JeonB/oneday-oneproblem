'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import classes from './header.module.css'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import logoImg from '@/public/images/logo.png'
import { useAuthStore } from '@/components/context/Store'

export default function Header() {
  const router = useRouter()
  const { data: session } = useSession()
  const { loginState, setLoginState } = useAuthStore()
  const onLogout = async () => {
    await signOut({ redirect: false })
    setLoginState(false)
    alert('로그아웃 되었습니다.')
    router.push('/')
  }

  return (
    <nav className={classes.nav}>
      <Link href="/">
        <Image
          src={logoImg}
          alt="logo"
          className="h-10 w-auto rounded-xl p-2 md:h-14 xl:h-16"
        />
      </Link>

      <ul className={classes.ul}>
        {loginState ? (
          <>
            <li className={classes.li}>
              <Link className={classes.a} href="/profile">
                {session?.user?.name}님 환영합니다.
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
