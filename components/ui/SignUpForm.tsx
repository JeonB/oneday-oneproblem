import React from 'react'

interface SignUpFormProps {
  name: string
  email: string
  password: string
  confirmPassword: string
  error: string
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  name,
  email,
  password,
  confirmPassword,
  error,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) => {
  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => onConfirmPasswordChange(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUpForm
