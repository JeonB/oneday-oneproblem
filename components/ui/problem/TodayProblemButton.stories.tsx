import type { Meta, StoryObj } from '@storybook/react'
import TodayProblemButton from './TodayProblemButton'
import { OneDayProvider } from '@/components/context/StoreContext'

const meta = {
  title: 'UI/Problem/TodayProblemButton',
  component: TodayProblemButton,
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
} satisfies Meta<typeof TodayProblemButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCustomStyling: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '기본 스타일링이 적용된 오늘의 문제 버튼',
      },
    },
  },
}

export const Disabled: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '비활성화된 상태의 버튼 (예: 이미 오늘 문제를 풀었을 때)',
      },
    },
  },
  render: () => (
    <button
      className="cursor-not-allowed rounded-full bg-gray-400 px-6 py-2 text-white"
      disabled>
      오늘의 문제 풀이 완료
    </button>
  ),
}
