'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from './login-form'
import { signIn } from 'next-auth/react'
import { useSignInAndUpStore } from '../../context/Store'

const Login: React.FC = () => {
  const { email, password } = useSignInAndUpStore()
  const [error, setError] = useState('')

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        throw new Error('Login failed')
      }

      router.push('/')
    } catch (err) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
    }
  }

  return <LoginForm error={error} onSubmit={handleLogin} />
}

export default Login
