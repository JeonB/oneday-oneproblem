import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'
import { columns } from './columns'
import { DataTable } from './data-table'
import { OneDayProvider } from '@/components/context/StoreContext'
import { ProblemProps } from '@/app/lib/models/Problem'

const meta = {
  title: 'UI/Profile/Problems/Columns',
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
]

export const Default: Story = {
  args: {
    columns: columns as any,
    data: mockData,
    className: 'w-full max-w-4xl',
  },
}

export const AllDifficulties: Story = {
  args: {
    columns: columns as any,
    data: [
      {
        id: '1',
        createdAt: '2024-01-15T10:30:00Z',
        topic: '배열',
        title: 'Easy Problem',
        difficulty: 'easy',
        userSolution: 'function solution(arr) { return Math.max(...arr); }',
        content: '<h3>문제 설명</h3><p>쉬운 문제입니다.</p>',
      },
      {
        id: '2',
        createdAt: '2024-01-14T14:20:00Z',
        topic: '문자열',
        title: 'Normal Problem',
        difficulty: 'normal',
        userSolution:
          'function solution(str) { return str.split("").reverse().join(""); }',
        content: '<h3>문제 설명</h3><p>보통 문제입니다.</p>',
      },
      {
        id: '3',
        createdAt: '2024-01-13T09:15:00Z',
        topic: '동적 프로그래밍',
        title: 'Hard Problem',
        difficulty: 'hard',
        userSolution:
          'function solution(n) { if (n <= 1) return n; return solution(n-1) + solution(n-2); }',
        content: '<h3>문제 설명</h3><p>어려운 문제입니다.</p>',
      },
    ],
    className: 'w-full max-w-4xl',
  },
  parameters: {
    docs: {
      description: {
        story: '모든 난이도의 문제가 포함된 테이블',
      },
    },
  },
}

export const DifferentTopics: Story = {
  args: {
    columns: columns as any,
    data: [
      {
        id: '1',
        createdAt: '2024-01-15T10:30:00Z',
        topic: '배열',
        title: 'Array Problem',
        difficulty: 'easy',
        userSolution: 'function solution(arr) { return Math.max(...arr); }',
        content: '<h3>문제 설명</h3><p>배열 문제입니다.</p>',
      },
      {
        id: '2',
        createdAt: '2024-01-14T14:20:00Z',
        topic: '문자열',
        title: 'String Problem',
        difficulty: 'normal',
        userSolution:
          'function solution(str) { return str.split("").reverse().join(""); }',
        content: '<h3>문제 설명</h3><p>문자열 문제입니다.</p>',
      },
      {
        id: '3',
        createdAt: '2024-01-13T09:15:00Z',
        topic: '그래프',
        title: 'Graph Problem',
        difficulty: 'hard',
        userSolution: 'function solution(graph) { /* Graph algorithm */ }',
        content: '<h3>문제 설명</h3><p>그래프 문제입니다.</p>',
      },
      {
        id: '4',
        createdAt: '2024-01-12T16:45:00Z',
        topic: '트리',
        title: 'Tree Problem',
        difficulty: 'normal',
        userSolution: 'function solution(root) { /* Tree traversal */ }',
        content: '<h3>문제 설명</h3><p>트리 문제입니다.</p>',
      },
      {
        id: '5',
        createdAt: '2024-01-11T11:30:00Z',
        topic: '스택',
        title: 'Stack Problem',
        difficulty: 'easy',
        userSolution: 'function solution(s) { /* Stack implementation */ }',
        content: '<h3>문제 설명</h3><p>스택 문제입니다.</p>',
      },
    ],
    className: 'w-full max-w-4xl',
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 주제의 문제들이 포함된 테이블',
      },
    },
  },
}
