import type { Meta, StoryObj } from '@storybook/react'
import { CodeExecutor } from './CodeExecutor'

const meta = {
  title: 'Components/CodeExecutor',
  component: CodeExecutor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    initialCode: {
      control: 'text',
    },
    testCases: {
      control: 'object',
    },
    onResult: {
      action: 'result',
    },
    onError: {
      action: 'error',
    },
  },
} satisfies Meta<typeof CodeExecutor>

export default meta
type Story = StoryObj<typeof meta>

const mockTestCases = [
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
    initialCode: `function solution(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
    testCases: mockTestCases,
  },
}

export const EmptyCode: Story = {
  args: {
    initialCode: '',
    testCases: mockTestCases,
  },
  parameters: {
    docs: {
      description: {
        story: '빈 코드 상태에서의 코드 실행기',
      },
    },
  },
}

export const WithError: Story = {
  args: {
    initialCode: `function solution(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
  // Missing closing brace
`,
    testCases: mockTestCases,
  },
  parameters: {
    docs: {
      description: {
        story: '문법 오류가 있는 코드',
      },
    },
  },
}

export const StringTestCases: Story = {
  args: {
    initialCode: `function solution(str) {
  return str.split('').reverse().join('');
}`,
    testCases: [
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
    initialCode: `function solution(matrix) {
  return matrix.flat().reduce((sum, num) => sum + num, 0);
}`,
    testCases: [
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

export const SingleTestCase: Story = {
  args: {
    initialCode: `function solution(arr) {
  return Math.max(...arr);
}`,
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        output: 5,
      },
    ],
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
    initialCode: `function solution(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
    testCases: [
      ...mockTestCases,
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
      {
        input: [19, 20, 21],
        output: 60,
      },
      {
        input: [22, 23, 24],
        output: 69,
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

export const WithConsoleLogs: Story = {
  args: {
    initialCode: `function solution(arr) {
  console.log('Processing array:', arr);
  const result = arr.reduce((sum, num) => sum + num, 0);
  console.log('Sum calculated:', result);
  return result;
}`,
    testCases: mockTestCases,
  },
  parameters: {
    docs: {
      description: {
        story: 'console.log가 포함된 코드',
      },
    },
  },
}

export const TimeoutCase: Story = {
  args: {
    initialCode: `function solution(arr) {
  // Simulate long running operation
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Busy wait
  }
  return arr.reduce((sum, num) => sum + num, 0);
}`,
    testCases: mockTestCases,
  },
  parameters: {
    docs: {
      description: {
        story: '타임아웃이 발생할 수 있는 코드',
      },
    },
  },
}
