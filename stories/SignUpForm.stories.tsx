import { Meta, StoryObj } from '@storybook/react'
import SignUpForm from '@/components/ui/SignUpForm'

const meta: Meta<typeof SignUpForm> = {
  title: 'Example/SignUpForm',
  component: SignUpForm,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SignUpForm>

export const Default: Story = {
  args: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    onNameChange: (value: string) => console.log('Name changed:', value),
    onEmailChange: (value: string) => console.log('Email changed:', value),
    onPasswordChange: (value: string) =>
      console.log('Password changed:', value),
    onConfirmPasswordChange: (value: string) =>
      console.log('Confirm password changed:', value),
    onSubmit: e => {
      e.preventDefault()
      console.log('Form submitted')
    },
  },
}

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Passwords do not match',
  },
}
