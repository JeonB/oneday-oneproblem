import type { Meta, StoryObj } from '@storybook/react'
import { Toaster } from './Toaster'

const meta = {
  title: 'UI/Toast/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    toasts: [],
    onHide: id => console.log('Toast hidden:', id),
  },
}

export const WithToasts: Story = {
  args: {
    toasts: [
      {
        id: '1',
        title: 'Success!',
        message: 'Your changes have been saved.',
        type: 'success',
      },
      {
        id: '2',
        title: 'Error!',
        message: 'Something went wrong.',
        type: 'error',
      },
      {
        id: '3',
        title: 'Warning!',
        message: 'Please check your input.',
        type: 'warning',
      },
    ],
    onHide: id => console.log('Toast hidden:', id),
  },
}

export const MultipleToasts: Story = {
  args: {
    toasts: [
      {
        id: '1',
        title: 'Success!',
        message: 'Your changes have been saved.',
        type: 'success',
      },
      {
        id: '2',
        title: 'Error!',
        message: 'Something went wrong.',
        type: 'error',
      },
      {
        id: '3',
        title: 'Warning!',
        message: 'Please check your input.',
        type: 'warning',
      },
      {
        id: '4',
        title: 'Info',
        message: 'Here is some information.',
        type: 'info',
      },
      {
        id: '5',
        title: 'Another Success',
        message: 'Another successful operation.',
        type: 'success',
      },
    ],
    onHide: id => console.log('Toast hidden:', id),
  },
}
