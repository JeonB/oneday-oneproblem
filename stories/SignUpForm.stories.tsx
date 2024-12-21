import { Meta, StoryObj } from '@storybook/react'
import SignUpForm from '@/components/ui/sign-up-form'

const meta: Meta<typeof SignUpForm> = {
  title: 'Example/SignUpForm',
  component: SignUpForm,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SignUpForm>

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
    error: 'Passwords do not match',
  },
}
