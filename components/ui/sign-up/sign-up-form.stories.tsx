import type { Meta, StoryObj } from '@storybook/react'
import { CardsCreateAccount } from './sign-up-form'
import { OneDayProvider } from '@/components/context/StoreContext'

const meta = {
  title: 'UI/SignUp/SignUpForm',
  component: CardsCreateAccount,
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
} satisfies Meta<typeof CardsCreateAccount>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    error: '',
    onSubmit: (e: React.FormEvent, file?: File | null) => {
      e.preventDefault()
      console.log('Sign up form submitted', { file })
    },
  },
}

export const WithError: Story = {
  args: {
    error: '회원 가입에 실패하였습니다. 다시 시도해주세요.',
    onSubmit: (e: React.FormEvent, file?: File | null) => {
      e.preventDefault()
      console.log('Sign up form submitted with error', { file })
    },
  },
}

export const WithValidationError: Story = {
  args: {
    error: '이메일 형식이 올바르지 않습니다.',
    onSubmit: (e: React.FormEvent, file?: File | null) => {
      e.preventDefault()
      console.log('Sign up form submitted with validation error', { file })
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

export const WithFileUpload: Story = {
  args: {
    error: '',
    onSubmit: (e: React.FormEvent, file?: File | null) => {
      e.preventDefault()
      console.log('Sign up form submitted with file', { file })
    },
  },
  parameters: {
    docs: {
      description: {
        story: '프로필 이미지 업로드가 포함된 회원가입',
      },
    },
  },
}

export const EmptyForm: Story = {
  args: {
    error: '',
    onSubmit: (e: React.FormEvent, file?: File | null) => {
      e.preventDefault()
      console.log('Empty sign up form submitted', { file })
    },
  },
  parameters: {
    docs: {
      description: {
        story: '빈 폼 상태에서의 회원가입',
      },
    },
  },
}
