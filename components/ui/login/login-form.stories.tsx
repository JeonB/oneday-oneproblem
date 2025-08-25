import type { Meta, StoryObj } from '@storybook/react'
import LoginForm from './login-form'
import { OneDayProvider } from '@/components/context/StoreContext'

const meta = {
  title: 'UI/Login/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <OneDayProvider>
        <Story />
      </OneDayProvider>
    ),
  ],
  argTypes: {
    error: {
      control: 'text',
    },
    onSubmit: {
      action: 'submitted',
    },
  },
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    error: undefined,
    onSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      console.log('Form submitted')
    },
  },
}

export const WithError: Story = {
  args: {
    error: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.',
    onSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      console.log('Form submitted with error')
    },
  },
}

export const EmptyForm: Story = {
  args: {
    error: undefined,
    onSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      console.log('Empty form submitted')
    },
  },
  parameters: {
    docs: {
      description: {
        story: '빈 폼 상태에서의 로그인 폼',
      },
    },
  },
}

export const WithValidationError: Story = {
  args: {
    error: '이메일 형식이 올바르지 않습니다.',
    onSubmit: (e: React.FormEvent) => {
      e.preventDefault()
      console.log('Form submitted with validation error')
    },
  },
  parameters: {
    docs: {
      description: {
        story: '유효성 검사 에러가 있는 상태',
      },
    },
  },
}
