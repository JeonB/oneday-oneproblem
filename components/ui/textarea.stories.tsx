import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './textarea'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    rows: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="message" className="text-sm font-medium">
        Message
      </label>
      <Textarea
        id="message"
        placeholder="Enter your message here..."
        className="min-h-[100px]"
      />
    </div>
  ),
}

export const WithValue: Story = {
  args: {
    value: 'This is a pre-filled textarea with some content.',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'This textarea is disabled',
  },
}

export const Large: Story = {
  args: {
    placeholder: 'Large textarea...',
    className: 'min-h-[200px]',
  },
}

export const Small: Story = {
  args: {
    placeholder: 'Small textarea...',
    className: 'min-h-[60px]',
  },
}

export const WithCharacterCount: Story = {
  render: () => {
    const [value, setValue] = React.useState('')
    const maxLength = 500

    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={value}
          onChange={e => setValue(e.target.value)}
          maxLength={maxLength}
          className="min-h-[100px]"
        />
        <div className="text-right text-xs text-gray-500">
          {value.length}/{maxLength}
        </div>
      </div>
    )
  },
}
