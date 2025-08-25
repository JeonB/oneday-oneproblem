import type { Meta, StoryObj } from '@storybook/react'
import DifficultyModal from './DifficultyModal'

const meta = {
  title: 'UI/Problem/DifficultyModal',
  component: DifficultyModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
    onClose: {
      action: 'closed',
    },
    onSelectDifficulty: {
      action: 'difficulty-selected',
    },
  },
} satisfies Meta<typeof DifficultyModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isOpen: true,
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
  },
}

export const WithCustomStyling: Story = {
  args: {
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: '모달이 열린 상태에서 난이도를 선택할 수 있습니다.',
      },
    },
  },
}
