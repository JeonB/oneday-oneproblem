'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from './login-form'
import { useStore } from '../context/StoreContext'
import jwt from 'jsonwebtoken'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { user, setUser } = useStore()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      const { token } = data
      localStorage.setItem('token', token)
      document.cookie = `token=${token}; path=/;`
      // Verify JWT token
      // const userResponse = await fetch('/api/user', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // })

      // if (!userResponse.ok) {
      //   throw new Error('Failed to fetch user data')
      // }

      // const userData = await userResponse.json()
      // console.log('User data:', userData)
      router.push('/')
    } catch (err) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
    }
  }

  return (
    <LoginForm
      email={email}
      password={password}
      error={error}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
    />
  )
}

export default Login
