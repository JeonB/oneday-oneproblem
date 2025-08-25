import type { Meta, StoryObj } from '@storybook/react'
import { ResultDisplay } from './ResultDisplay'

const meta = {
  title: 'UI/Problem/ResultDisplay',
  component: ResultDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ResultDisplay>

export default meta
type Story = StoryObj<typeof meta>

const formatResult = (value: any) =>
  Array.isArray(value) ? JSON.stringify(value) : String(value)

export const AllPassed: Story = {
  args: {
    results: [
      {
        input: [1, 2, 3],
        output: 6,
        result: 6,
        passed: true,
        logs: ['Processing array...', 'Sum calculated: 6'],
      },
      {
        input: [4, 5, 6],
        output: 15,
        result: 15,
        passed: true,
        logs: ['Processing array...', 'Sum calculated: 15'],
      },
    ],
    formatResult,
  },
}

export const MixedResults: Story = {
  args: {
    results: [
      {
        input: [1, 2, 3],
        output: 6,
        result: 6,
        passed: true,
        logs: ['Processing array...', 'Sum calculated: 6'],
      },
      {
        input: [4, 5, 6],
        output: 15,
        result: 14,
        passed: false,
        logs: ['Processing array...', 'Sum calculated: 14'],
      },
    ],
    formatResult,
  },
}

export const AllFailed: Story = {
  args: {
    results: [
      {
        input: [1, 2, 3],
        output: 6,
        result: 5,
        passed: false,
        logs: ['Processing array...', 'Sum calculated: 5'],
      },
      {
        input: [4, 5, 6],
        output: 15,
        result: 12,
        passed: false,
        logs: ['Processing array...', 'Sum calculated: 12'],
      },
    ],
    formatResult,
  },
}

export const WithError: Story = {
  args: {
    results: [
      {
        input: [1, 2, 3],
        output: 6,
        result: 6,
        passed: true,
        logs: ['Processing array...', 'Sum calculated: 6'],
      },
      {
        input: [4, 5, 6],
        output: 15,
        result: 15,
        passed: true,
        logs: ['Processing array...', 'Sum calculated: 15'],
      },
      {
        error: 'SyntaxError: Unexpected token',
        input: [7, 8, 9],
        output: 24,
        result: null,
        passed: false,
      },
    ],
    formatResult,
  },
}

export const LongLogs: Story = {
  args: {
    results: [
      {
        input: [1, 2, 3, 4, 5],
        output: 15,
        result: 15,
        passed: true,
        logs: Array.from({ length: 50 }, (_, i) => `Log message ${i + 1}`),
      },
    ],
    formatResult,
  },
}

export const EmptyResults: Story = {
  args: {
    results: [],
    formatResult,
  },
}
