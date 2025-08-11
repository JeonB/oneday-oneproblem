import SignUp from '@/components/ui/sign-up/sign-up'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '회원가입',
  description: '회원가입 상세페이지',
}

export default function CreateAccount() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp />
    </div>
  )
}
