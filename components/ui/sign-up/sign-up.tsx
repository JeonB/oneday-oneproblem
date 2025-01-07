'use client'
import React, { useState } from 'react'
import CardsCreateAccount from './sign-up-form'
import { useRouter } from 'next/navigation'
import { useSignInAndUpStore } from '../../context/Store'
import { signIn } from 'next-auth/react'

const SignUp: React.FC = () => {
  const { name, email, password } = useSignInAndUpStore()
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        throw new Error('회원가입 실패')
      }

      const data = await response.json()
      console.log('User signed up successfully:', data)

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
