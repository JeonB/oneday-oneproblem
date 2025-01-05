import { Feedback } from '@/components/ui/problem/Feedback'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Example/Feedback',
  component: Feedback,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Feedback>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
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
}

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
