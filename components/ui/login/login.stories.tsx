import type { Meta, StoryObj } from '@storybook/react'
import Login from './login'
import { OneDayProvider } from '@/components/context/StoreContext'

const meta = {
  title: 'UI/Login/Login',
  component: Login,
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
} satisfies Meta<typeof Login>

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
        story: '로그인 실패 시 에러 메시지가 표시되는 상태',
      },
    },
  },
}

export const Loading: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '로그인 처리 중인 상태',
      },
    },
  },
}
