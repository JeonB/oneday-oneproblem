import type { Meta, StoryObj } from '@storybook/react'
import { Toast } from './Toast'

const meta = {
  title: 'UI/Toast/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    duration: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    id: '1',
    title: 'Success!',
    message: 'Your changes have been saved successfully.',
    type: 'success',
    onHide: id => console.log('Toast hidden:', id),
  },
}

export const Error: Story = {
  args: {
    id: '2',
    title: 'Error!',
    message: 'Something went wrong. Please try again.',
    type: 'error',
    onHide: id => console.log('Toast hidden:', id),
  },
}

export const Warning: Story = {
  args: {
    id: '3',
    title: 'Warning!',
    message: 'Please check your input before proceeding.',
    type: 'warning',
    onHide: id => console.log('Toast hidden:', id),
  },
}

export const Info: Story = {
  args: {
    id: '4',
    title: 'Information',
    message: 'Here is some useful information for you.',
    type: 'info',
    onHide: id => console.log('Toast hidden:', id),
  },
}

export const WithoutMessage: Story = {
  args: {
    id: '5',
    title: 'Simple notification',
    type: 'success',
    onHide: id => console.log('Toast hidden:', id),
  },
}

export const LongMessage: Story = {
  args: {
    id: '6',
    title: 'Long Message',
    message:
      'This is a very long message that demonstrates how the toast component handles text that spans multiple lines and contains a lot of content. It should wrap properly and maintain good readability.',
    type: 'info',
    onHide: id => console.log('Toast hidden:', id),
  },
}
