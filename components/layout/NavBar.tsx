'use client'
import logoImg from '@/public/images/logo.png'
import Link from 'next/link'
import Image from 'next/image'
import classes from './navbar.module.css'

export default function NavBar() {
  return (
    <div className={classes.container}>
      <nav className={classes.nav}>
        <Link href="/">
          <Image src={logoImg} alt="logo" className={classes.logo} priority />
        </Link>
        <ul className={classes.ul}>
          {/* <li className={classes.li}>
            <ul className={classes.submenu}>
              <li>
                <Link href="/company/history-timeline" prefetch={true}>
                  하이요
                </Link>
              </li>
              <li>
                <Link href="/company/ceo-greeting">하이요2</Link>
              </li>
            </ul>
          </li> */}

          <li className={classes.li}>
            <Link className={classes.a} href="/business">
              gg
            </Link>
          </li>
          <li className={classes.li}>
            <Link className={classes.a} href="/product">
              ss
            </Link>
          </li>
          <li className={classes.li}>
            <Link className={classes.a} href="/recruit">
              dd
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
