import type { Meta, StoryObj } from '@storybook/react'
import SignUp from './sign-up'
import { OneDayProvider } from '@/components/context/StoreContext'

const meta = {
  title: 'UI/SignUp/SignUp',
  component: SignUp,
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
} satisfies Meta<typeof SignUp>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithError: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '회원가입 실패 시 에러 메시지가 표시되는 상태',
      },
    },
  },
}

export const Loading: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '회원가입 처리 중인 상태',
      },
    },
  },
}
