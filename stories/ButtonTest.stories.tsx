import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button } from '@/components/ui/button'

const meta = {
  title: 'Example/ButtonTest',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: [
          'default',
          'destructive',
          'outline',
          'secondary',
          'ghost',
          'link',
        ],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['default', 'sm', 'lg', 'icon'],
      },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'test',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'default',
    children: '디스트럭티브',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: '아웃라인',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'default',
    children: '세컨더리',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: '고스트',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    size: 'default',
  },
}

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    variant: 'default',
    size: 'lg',
  },
}

export const Icon: Story = {
  args: {
    variant: 'default',
    size: 'icon',
  },
}
