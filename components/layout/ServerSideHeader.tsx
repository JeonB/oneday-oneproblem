import Link from 'next/link'
import Image from 'next/image'
import { cookies } from 'next/headers'
import ClientHeader from './ClientHeader'
import logoImg from '@/public/images/logo.png'
import jwt from 'jsonwebtoken'

type UserToken = {
  name: string
  email: string
  iat: number
  exp: number
}
export default async function Header() {
  const cookieStore = await cookies()
  const cookieUser = cookieStore.get('token')?.value
  const decoded = cookieUser
    ? (jwt.verify(cookieUser, process.env.JWT_SECRET!) as UserToken)
    : null

  const user = decoded ? { name: decoded.name } : null
  return (
    <ClientHeader>
      <Link href="/">
        <Image
          src={logoImg}
          alt="logo"
          priority
          className="h-10 w-auto rounded-xl p-2 md:h-14 xl:h-16"
        />
      </Link>
    </ClientHeader>
  )
}
