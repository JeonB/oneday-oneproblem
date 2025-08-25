import type { Meta, StoryObj } from '@storybook/react'
import CardListSkeleton from './CardListSkeleton'

const meta = {
  title: 'UI/Problem/CardListSkeleton',
  component: CardListSkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardListSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCustomCount: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '기본 20개의 스켈레톤 카드들이 표시됩니다.',
      },
    },
  },
}

export const LoadingState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '알고리즘 카드들이 로딩 중일 때 표시되는 스켈레톤',
      },
    },
  },
}
