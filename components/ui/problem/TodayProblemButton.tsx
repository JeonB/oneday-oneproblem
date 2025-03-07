'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../button'

export default function TodayProblemButton() {
  const router = useRouter()

  const getRandomDifficulty = () =>
    ['easy', 'normal', 'hard'][Math.floor(Math.random() * 3)]

  return (
    <Button
      className="rounded-full bg-[#43B9AA] px-6 py-2 text-white"
      onClick={() =>
        router.push(`/problem/random?difficulty=${getRandomDifficulty()}`)
      }>
      오늘의 문제 풀이
    </Button>
  )
}
