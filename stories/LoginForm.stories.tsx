import type { Meta, StoryObj } from '@storybook/react'
import LoginForm from '@/components/ui/LoginForm'

const meta: Meta<typeof LoginForm> = {
  title: 'Example/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof LoginForm>

export const Default: Story = {
  args: {
    email: '',
    password: '',
    error: '',
    onEmailChange: (value: string) => console.log('Email changed:', value),
    onPasswordChange: (value: string) =>
      console.log('Password changed:', value),
    onSubmit: e => {
      e.preventDefault()
      console.log('Form submitted')
    },
  },
}

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Invalid credentials',
  },
}
