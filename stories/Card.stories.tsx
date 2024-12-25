import type { Meta, StoryObj } from '@storybook/react'
import Card from '@/components/ui/problem/AlgorithmCard'

const meta: Meta<typeof Card> = {
  title: 'Example/Card', // Storybook에서 보여줄 컴포넌트의 이름
  component: Card, // 사용할 컴포넌트 지정
  tags: ['autodocs'], // 자동 문서화 관련 설정
  parameters: {
    layout: 'fullscreen', // 레이아웃을 풀스크린으로 설정
  },
}

export default meta

type Story = StoryObj<typeof meta>

// 기본 예시
export const Default: Story = {
  args: {
    topic: '알고리즘 대주제',
    img: 'logoImg.png',
    algorithm: '알고리즘 이름',
  },
}

// 제목을 포함한 카드 예시
export const WithTitle: Story = {
  args: {
    topic: '정렬',
    algorithm: 'Quick Sort',
  },
}

// 내용과 함께한 카드 예시
export const WithContent: Story = {
  args: {
    topic: '탐색',
    algorithm: 'Binary Search',
  },
}
