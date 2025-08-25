import type { Meta, StoryObj } from '@storybook/react'
import CardList from './CardList'
import { OneDayProvider } from '@/components/context/StoreContext'

const meta = {
  title: 'UI/Problem/CardList',
  component: CardList,
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
} satisfies Meta<typeof CardList>

export default meta
type Story = StoryObj<typeof meta>

const mockAlgorithms = [
  {
    topic: 'array',
    name: '배열',
    img: '/images/array.png',
  },
  {
    topic: 'string',
    name: '문자열',
    img: '/images/string.png',
  },
  {
    topic: 'dp',
    name: '동적 프로그래밍',
    img: '/images/dp.png',
  },
  {
    topic: 'graph',
    name: '그래프',
    img: '/images/graph.png',
  },
  {
    topic: 'tree',
    name: '트리',
    img: '/images/tree.png',
  },
  {
    topic: 'stack',
    name: '스택',
    img: '/images/stack.png',
  },
  {
    topic: 'queue',
    name: '큐',
    img: '/images/queue.png',
  },
  {
    topic: 'hash',
    name: '해시 테이블',
    img: '/images/hash.png',
  },
]

export const Default: Story = {
  args: {
    algorithms: mockAlgorithms,
  },
}

export const FewAlgorithms: Story = {
  args: {
    algorithms: mockAlgorithms.slice(0, 3),
  },
  parameters: {
    docs: {
      description: {
        story: '적은 수의 알고리즘 카드들',
      },
    },
  },
}

export const ManyAlgorithms: Story = {
  args: {
    algorithms: [
      ...mockAlgorithms,
      {
        topic: 'heap',
        name: '힙',
        img: '/images/heap.png',
      },
      {
        topic: 'sort',
        name: '정렬',
        img: '/images/sort.png',
      },
      {
        topic: 'search',
        name: '탐색',
        img: '/images/search.png',
      },
      {
        topic: 'greedy',
        name: '그리디',
        img: '/images/greedy.png',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '많은 수의 알고리즘 카드들',
      },
    },
  },
}

export const Empty: Story = {
  args: {
    algorithms: [],
  },
  parameters: {
    docs: {
      description: {
        story: '알고리즘 카드가 없는 상태',
      },
    },
  },
}
