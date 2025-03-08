'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../button'
import { useProblemStore } from '@/components/context/Store'

export default function TodayProblemButton() {
  const router = useRouter()

  const getRandomDifficulty = () =>
    ['easy', 'normal', 'hard'][Math.floor(Math.random() * 3)]

  const updateProblemStore = () => {
    useProblemStore.setState({
      topic: '',
      content: '',
      userSolution: '',
    })
  }

  return (
    <Button
      className="rounded-full bg-[#43B9AA] px-6 py-2 text-white"
      onClick={() => {
        updateProblemStore()
        router.push(`/problem/random?difficulty=${getRandomDifficulty()}`)
      }}>
      오늘의 문제 풀이
    </Button>
  )
}
