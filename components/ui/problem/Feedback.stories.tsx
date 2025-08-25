import type { Meta, StoryObj } from '@storybook/react'
import { Feedback } from './Feedback'

const meta = {
  title: 'UI/Problem/Feedback',
  component: Feedback,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Feedback>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    timeComplexity: 'O(n)',
    feedback: {
      efficiency: 'High',
      readability: 'Good',
    },
    aiImprovedCode: `function solution(inputString) {
  // 문자 빈도수를 저장할 객체
  const frequency = {};

  // 문자열을 순회하며 빈도 계산
  for (const char of inputString) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  // 최대 빈도와 해당 문자를 저장할 변수
  let maxFrequency = 0;
  let result = '';

  // 빈도 객체를 순회하며 가장 빈도가 높은 문자 찾기
  for (const [char, count] of Object.entries(frequency)) {
    if (
      count > maxFrequency ||
      (count === maxFrequency && char < result)
    ) {
      maxFrequency = count;
      result = char;
    }
  }

  return result;
}`,
  },
}

export const WithError: Story = {
  args: {
    timeComplexity: '',
    feedback: {
      efficiency: '',
      readability: '',
    },
    aiImprovedCode: '',
    error: 'An error occurred while generating feedback.',
  },
}

export const ComplexFeedback: Story = {
  args: {
    timeComplexity: 'O(n log n)',
    feedback: {
      efficiency: 'Medium',
      readability: 'Excellent',
    },
    aiImprovedCode: `function optimizedSolution(arr) {
  // 정렬을 사용한 최적화된 해결책
  const sorted = [...arr].sort((a, b) => a - b);

  // 중복 제거 및 빈도 계산
  const frequency = {};
  for (const num of sorted) {
    frequency[num] = (frequency[num] || 0) + 1;
  }

  // 가장 빈도가 높은 요소 찾기
  return Object.entries(frequency)
    .reduce((max, [key, count]) =>
      count > max.count ? { key, count } : max
    , { key: '', count: 0 }).key;
}`,
  },
}

export const SimpleFeedback: Story = {
  args: {
    timeComplexity: 'O(1)',
    feedback: {
      efficiency: 'Excellent',
      readability: 'Good',
    },
    aiImprovedCode: `function simpleSolution(x, y) {
  return x + y;
}`,
  },
}
