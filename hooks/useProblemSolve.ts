import { useProblemStore } from '@/components/context/StoreContext'
import { TestResult } from '@/components/ui/problem/ResultDisplay'
import { useCallback, useEffect, useState } from 'react'

export const useProblemSolve = ({
  email,
  userId,
  results,
}: {
  email?: string
  userId?: string
  results: TestResult[]
}) => {
  const { title, topic, difficulty, content, userSolution } = useProblemStore(
    state => state,
  )
  const [problemSolved, setProblemSolved] = useState(false)
  const handleProblemSolve = useCallback(async () => {
    try {
      const response = await fetch('/api/problemSolved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          email,
          userId,
          topic,
          difficulty,
          content,
          userSolution,
        }),
      })

      if (response.ok) {
        alert('문제를 성공적으로 풀었습니다!')
        setProblemSolved(true)
      } else {
        throw new Error('문제 풀이 업데이트에 실패했습니다.')
      }
    } catch (error) {
      console.error(error)
      alert('문제를 푸는 데 실패했습니다.')
    }
  }, [title, email, userId, topic, difficulty, content, userSolution])

  useEffect(() => {
    if (
      !problemSolved &&
      results.length > 0 &&
      results.every(result => !result.error && result.passed)
    ) {
      handleProblemSolve()
    }
  }, [results, problemSolved, handleProblemSolve])
}
