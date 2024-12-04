import React, { useState } from 'react'
import SignUpForm from './SignUpForm'

const SignUp: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

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
      // Handle successful sign up (e.g., redirect or show success message)
    } catch (err) {
      setError('Sign up failed. Please try again.')
    }
  }

  return (
    <SignUpForm
      name={name}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      error={error}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onSubmit={handleSignUp}
    />
  )
}
export default SignUp
