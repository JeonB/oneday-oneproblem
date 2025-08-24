'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import classes from './header.module.css'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import logoImg from '@/public/images/logo.png'
import { useAuthStore } from '@/components/context/StoreContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast/ToastProvider'

export default function Header() {
  const router = useRouter()
  const { data: session } = useSession()
  const loginState = useAuthStore(state => state.loginState)
  const setLoginState = useAuthStore(state => state.setLoginState)
  const { showToast } = useToast()

  const onLogout = async () => {
    await signOut({ redirect: false })
    setLoginState(false)
    showToast({
      title: '로그아웃',
      message: '로그아웃 되었습니다.',
      type: 'info',
    })
    router.push('/')
  }

  const pathname = usePathname()
  const isProblemPage = pathname.startsWith('/problem')
  return (
    <>
      {!isProblemPage && (
        <nav className={classes.nav}>
          <Link href="/" className={classes.a}>
            <div className="flex items-center gap-2">
              <Image
                src={logoImg}
                alt="logo"
                className="h-10 w-auto rounded-xl p-2 md:h-14 xl:h-16"
              />
              1일 1문제
            </div>
          </Link>

          <ul className={classes.ul}>
            {loginState ? (
              <>
                <li className={classes.li}>
                  <Link className="flex flex-row items-center" href="/profile">
                    <Avatar>
                      <AvatarImage
                        src={
                          session?.user?.image ||
                          '/images/avatar-placeholder.png'
                        }
                        alt="@shadcn"
                        className="object-cover"
                      />
                      <AvatarFallback> {session?.user?.name}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">{session?.user?.name}</div>
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
      )}
    </>
  )
}
