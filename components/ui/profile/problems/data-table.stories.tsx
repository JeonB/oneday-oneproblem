import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { OneDayProvider } from '@/components/context/StoreContext'

const meta = {
  title: 'UI/Profile/Problems/DataTable',
  component: DataTable,
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
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

const mockData = [
  {
    id: '1',
    createdAt: '2024-01-15T10:30:00Z',
    topic: '배열',
    title: '배열에서 최댓값 찾기',
    difficulty: 'easy',
    userSolution: 'function solution(arr) { return Math.max(...arr); }',
    content: '<h3>문제 설명</h3><p>배열에서 최댓값을 찾으세요.</p>',
  },
  {
    id: '2',
    createdAt: '2024-01-14T14:20:00Z',
    topic: '문자열',
    title: '문자열 뒤집기',
    difficulty: 'normal',
    userSolution:
      'function solution(str) { return str.split("").reverse().join(""); }',
    content: '<h3>문제 설명</h3><p>문자열을 뒤집으세요.</p>',
  },
  {
    id: '3',
    createdAt: '2024-01-13T09:15:00Z',
    topic: '동적 프로그래밍',
    title: '피보나치 수열',
    difficulty: 'hard',
    userSolution:
      'function solution(n) { if (n <= 1) return n; return solution(n-1) + solution(n-2); }',
    content: '<h3>문제 설명</h3><p>n번째 피보나치 수를 구하세요.</p>',
  },
  {
    id: '4',
    createdAt: '2024-01-12T16:45:00Z',
    topic: '그래프',
    title: '깊이 우선 탐색',
    difficulty: 'normal',
    userSolution:
      'function solution(graph, start) { /* DFS implementation */ }',
    content: '<h3>문제 설명</h3><p>그래프에서 DFS를 구현하세요.</p>',
  },
  {
    id: '5',
    createdAt: '2024-01-11T11:30:00Z',
    topic: '트리',
    title: '이진 트리 순회',
    difficulty: 'easy',
    userSolution: 'function solution(root) { /* Tree traversal */ }',
    content: '<h3>문제 설명</h3><p>이진 트리를 순회하세요.</p>',
  },
]

export const Default: Story = {
  args: {
    columns,
    data: mockData,
    className: 'w-full max-w-4xl',
  },
}

export const Empty: Story = {
  args: {
    columns,
    data: [],
    className: 'w-full max-w-4xl',
  },
  parameters: {
    docs: {
      description: {
        story: '풀이 기록이 없는 상태',
      },
    },
  },
}

export const SingleRecord: Story = {
  args: {
    columns,
    data: [mockData[0]],
    className: 'w-full max-w-4xl',
  },
  parameters: {
    docs: {
      description: {
        story: '단일 풀이 기록만 있는 상태',
      },
    },
  },
}

export const ManyRecords: Story = {
  args: {
    columns,
    data: [
      ...mockData,
      {
        id: '6',
        createdAt: '2024-01-10T13:20:00Z',
        topic: '스택',
        title: '괄호 매칭',
        difficulty: 'easy',
        userSolution: 'function solution(s) { /* Stack implementation */ }',
        content:
          '<h3>문제 설명</h3><p>괄호가 올바르게 매칭되는지 확인하세요.</p>',
      },
      {
        id: '7',
        createdAt: '2024-01-09T15:10:00Z',
        topic: '큐',
        title: '큐 구현',
        difficulty: 'normal',
        userSolution: 'class Queue { /* Queue implementation */ }',
        content: '<h3>문제 설명</h3><p>큐를 구현하세요.</p>',
      },
      {
        id: '8',
        createdAt: '2024-01-08T08:45:00Z',
        topic: '해시 테이블',
        title: '두 수의 합',
        difficulty: 'normal',
        userSolution:
          'function solution(nums, target) { /* Hash table solution */ }',
        content:
          '<h3>문제 설명</h3><p>두 수의 합이 target이 되는 인덱스를 찾으세요.</p>',
      },
    ],
    className: 'w-full max-w-4xl',
  },
  parameters: {
    docs: {
      description: {
        story: '많은 풀이 기록이 있는 상태',
      },
    },
  },
}
