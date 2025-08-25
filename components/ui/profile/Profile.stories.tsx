import type { Meta, StoryObj } from '@storybook/react'
import { ProfileForm } from './Profile'
import { OneDayProvider } from '@/components/context/StoreContext'

const meta = {
  title: 'UI/Profile/ProfileForm',
  component: ProfileForm,
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
    defaultValues: {
      control: 'object',
    },
  },
} satisfies Meta<typeof ProfileForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValues: {
      username: 'John Doe',
      password: '',
      totalProblemsSolved: 42,
      streak: 7,
      profileImage: '/images/avatar-placeholder.png',
    },
  },
}

export const NewUser: Story = {
  args: {
    defaultValues: {
      username: '',
      password: '',
      totalProblemsSolved: 0,
      streak: 0,
      profileImage: '/images/avatar-placeholder.png',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '새로운 사용자의 프로필 폼',
      },
    },
  },
}

export const ExperiencedUser: Story = {
  args: {
    defaultValues: {
      username: 'Algorithm Master',
      password: '',
      totalProblemsSolved: 150,
      streak: 30,
      profileImage: '/images/avatar-placeholder.png',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '경험 많은 사용자의 프로필 폼',
      },
    },
  },
}

export const WithCustomImage: Story = {
  args: {
    defaultValues: {
      username: 'Jane Smith',
      password: '',
      totalProblemsSolved: 75,
      streak: 15,
      profileImage: 'https://github.com/shadcn.png',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 프로필 이미지가 있는 사용자',
      },
    },
  },
}

export const LongStreak: Story = {
  args: {
    defaultValues: {
      username: 'Streak Champion',
      password: '',
      totalProblemsSolved: 200,
      streak: 365,
      profileImage: '/images/avatar-placeholder.png',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '긴 연속 풀이 기록을 가진 사용자',
      },
    },
  },
}
