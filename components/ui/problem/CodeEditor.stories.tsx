import type { Meta, StoryObj } from '@storybook/react'
import CodeEditor from './CodeEditor'
import { OneDayProvider } from '@/components/context/StoreContext'

const meta = {
  title: 'UI/Problem/CodeEditor',
  component: CodeEditor,
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
  argTypes: {
    initialInput: {
      control: 'text',
    },
  },
} satisfies Meta<typeof CodeEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    initialInput: 'arr',
  },
}

export const WithArrayInput: Story = {
  args: {
    initialInput: ['arr', 'target'],
  },
  parameters: {
    docs: {
      description: {
        story: '배열 형태의 입력 파라미터',
      },
    },
  },
}

export const WithStringInput: Story = {
  args: {
    initialInput: 'str',
  },
  parameters: {
    docs: {
      description: {
        story: '문자열 입력 파라미터',
      },
    },
  },
}

export const WithMultipleInputs: Story = {
  args: {
    initialInput: ['nums', 'target', 'k'],
  },
  parameters: {
    docs: {
      description: {
        story: '여러 개의 입력 파라미터',
      },
    },
  },
}

export const WithComplexInput: Story = {
  args: {
    initialInput: ['matrix', 'word'],
  },
  parameters: {
    docs: {
      description: {
        story: '복잡한 입력 파라미터 (2D 배열과 문자열)',
      },
    },
  },
}
