import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Label',
  },
}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <input
        type="email"
        id="email"
        placeholder="Enter your email"
        className="w-full rounded-md border px-3 py-2"
      />
    </div>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <input type="checkbox" id="terms" className="rounded border-gray-300" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const WithRadio: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input type="radio" id="option1" name="options" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <input type="radio" id="option2" name="options" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <input type="radio" id="option3" name="options" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled" className="text-gray-500">
        Disabled Input
      </Label>
      <input
        type="text"
        id="disabled"
        disabled
        placeholder="This input is disabled"
        className="w-full rounded-md border bg-gray-100 px-3 py-2"
      />
    </div>
  ),
}
