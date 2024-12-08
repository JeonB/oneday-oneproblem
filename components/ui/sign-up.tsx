'use client'
import React, { useState } from 'react'
import CardsCreateAccount from './sign-up-form'
import { useRouter } from 'next/navigation'
import { AlertDialogUI } from './AlertDialog'

const SignUp: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  //   const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const showAlertDialog = () => {
    return (
      <AlertDialogUI
        label={'회원가입'}
        title={'회원가입 완료'}
        description={'회원가입에 성공했습니다!'}
      />
    )
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    // if (password !== confirmPassword) {
    //   setError('Passwords do not match')
    //   return
    // }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        throw new Error('Sign up failed')
      }

      const data = await response.json()
      console.log('User signed up successfully:', data)

      // Store the JWT in localStorage
      localStorage.setItem('token', data.token)

      showAlertDialog()
      router.push('/')
    } catch (err) {
      setError('Sign up failed. Please try again.')
    }
  }

  return (
    <CardsCreateAccount
      name={name}
      email={email}
      password={password}
      //   confirmPassword={confirmPassword}
      error={error}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      //   onConfirmPasswordChange={setConfirmPassword}
      onSubmit={handleSignUp}
    />
  )
}
export default SignUp
