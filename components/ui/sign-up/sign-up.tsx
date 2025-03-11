'use client'
import React, { useState } from 'react'
import CardsCreateAccount from './sign-up-form'
import { useRouter } from 'next/navigation'
import { useSignInAndUpStore } from '@/components/context/StoreContext'
import { signIn } from 'next-auth/react'

const SignUp: React.FC = () => {
  const name = useSignInAndUpStore(state => state.name)
  const email = useSignInAndUpStore(state => state.email)
  const password = useSignInAndUpStore(state => state.password)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent, file?: File | null) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)

      if (file) {
        formData.append('profileImage', file)
      }
      const response = await fetch('/api/user', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('회원가입 실패')
      }

      alert('회원가입에 성공했습니다.')

      // 자동 로그인 처리
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        throw new Error('로그인 실패')
      }

      router.push('/')
    } catch (err) {
      setError('회원 가입에 실패하였습니다. 다시 시도해주세요.')
    }
  }

  return <CardsCreateAccount error={error} onSubmit={handleSignUp} />
}
export default SignUp
