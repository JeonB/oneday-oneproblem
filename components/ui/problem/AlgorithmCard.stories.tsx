import type { Meta, StoryObj } from '@storybook/react'
import Card from './AlgorithmCard'

const meta = {
  title: 'UI/Problem/AlgorithmCard',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    algorithm: {
      control: 'text',
    },
    img: {
      control: 'text',
    },
    onClick: {
      action: 'clicked',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    algorithm: '배열',
    img: '/images/array.png',
  },
}

export const String: Story = {
  args: {
    algorithm: '문자열',
    img: '/images/string.png',
  },
}

export const DynamicProgramming: Story = {
  args: {
    algorithm: '동적 프로그래밍',
    img: '/images/dp.png',
  },
}

export const Graph: Story = {
  args: {
    algorithm: '그래프',
    img: '/images/graph.png',
  },
}

export const Tree: Story = {
  args: {
    algorithm: '트리',
    img: '/images/tree.png',
  },
}

export const Stack: Story = {
  args: {
    algorithm: '스택',
    img: '/images/stack.png',
  },
}

export const Queue: Story = {
  args: {
    algorithm: '큐',
    img: '/images/queue.png',
  },
}

export const HashTable: Story = {
  args: {
    algorithm: '해시 테이블',
    img: '/images/hash.png',
  },
}
