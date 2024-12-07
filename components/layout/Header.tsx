'use client'
import logoImg from '@/public/images/logo.png'
import Link from 'next/link'
import Image from 'next/image'
import classes from './header.module.css'

export default function Header() {
  return (
    <nav className={classes.nav}>
      <Link href="/">
        <Image src={logoImg} alt="logo" className={classes.logo} priority />
      </Link>
      <ul className={classes.ul}>
        <li className={classes.li}>
          <Link className={classes.a} href="/login">
            로그인/회원가입
          </Link>
        </li>
      </ul>
    </nav>
  )
}
