import type { Meta, StoryObj } from '@storybook/react'
import CodeExecution from './CodeExecution'
import { OneDayProvider } from '@/components/context/StoreContext'

const meta = {
  title: 'UI/Problem/CodeExecution',
  component: CodeExecution,
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
} satisfies Meta<typeof CodeExecution>

export default meta
type Story = StoryObj<typeof meta>

const mockInputOutput = [
  {
    input: [1, 2, 3],
    output: 6,
  },
  {
    input: [4, 5, 6],
    output: 15,
  },
  {
    input: [7, 8, 9],
    output: 24,
  },
]

export const Default: Story = {
  args: {
    inputOutput: mockInputOutput,
  },
}

export const SingleTestCase: Story = {
  args: {
    inputOutput: [mockInputOutput[0]],
  },
  parameters: {
    docs: {
      description: {
        story: '단일 테스트 케이스',
      },
    },
  },
}

export const ManyTestCases: Story = {
  args: {
    inputOutput: [
      ...mockInputOutput,
      {
        input: [10, 11, 12],
        output: 33,
      },
      {
        input: [13, 14, 15],
        output: 42,
      },
      {
        input: [16, 17, 18],
        output: 51,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '많은 테스트 케이스들',
      },
    },
  },
}

export const StringTestCases: Story = {
  args: {
    inputOutput: [
      {
        input: 'hello',
        output: 'olleh',
      },
      {
        input: 'world',
        output: 'dlrow',
      },
      {
        input: 'algorithm',
        output: 'mhtirogla',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '문자열 관련 테스트 케이스들',
      },
    },
  },
}

export const ComplexTestCases: Story = {
  args: {
    inputOutput: [
      {
        input: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        output: 45,
      },
      {
        input: [
          [1, 1],
          [2, 2],
        ],
        output: 6,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '복잡한 데이터 구조의 테스트 케이스들',
      },
    },
  },
}

export const EmptyTestCases: Story = {
  args: {
    inputOutput: [],
  },
  parameters: {
    docs: {
      description: {
        story: '테스트 케이스가 없는 상태',
      },
    },
  },
}
