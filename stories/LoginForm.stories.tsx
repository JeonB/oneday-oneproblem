import type { Meta, StoryObj } from '@storybook/react'
import LoginForm from '@/components/ui/login/login-form'

const meta: Meta<typeof LoginForm> = {
  title: 'Example/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof LoginForm>

export const Default: Story = {
  args: {
    error: '',
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
