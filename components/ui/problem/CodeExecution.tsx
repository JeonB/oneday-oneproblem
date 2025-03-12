'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useProblemStore } from '@/components/context/StoreContext'
import generateFeedback from '@/app/lib/generateFeedback'
import clsx from 'clsx'
import { Feedback, FeedbackState } from './Feedback'
import { TestResult, ResultDisplay } from './ResultDisplay'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * CodeExecution 컴포넌트는 사용자가 코드를 실행하고 AI 피드백을 받을 수 있는 UI를 제공합니다.
 * @component
 */

/**
 * 코드를 실행하고 결과를 설정하는 함수입니다.
 * @function
 * @async
 * @name runCode
 * @returns {Promise<void>}
 */

/**
 * 결과 값을 포맷팅하는 함수입니다.
 * @function
 * @name formatResult
 * @param {any} value - 포맷팅할 값
 * @returns {string} 포맷팅된 값
 */

/**
 * AI에게 피드백을 요청하는 함수입니다.
 * @function
 * @async
 * @name submitToAI
 * @returns {Promise<void>}
 */

/**
 * 문제를 해결했을 때 서버에 업데이트하는 함수입니다.
 * @function
 * @async
 * @name handleProblemSolve
 * @returns {Promise<void>}
 */

/**
 * 컴포넌트가 마운트될 때와 결과가 업데이트될 때 문제 해결 여부를 확인하는 useEffect 훅입니다.
 * @function
 * @name useEffect
 */
export default function CodeExecution() {
  const [results, setResults] = useState<TestResult[]>([])
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [isLoadingFeedback, setLoadingFeedback] = useState(false)
  const [problemSolved, setProblemSolved] = useState(false)
  const { data: session } = useSession()
  const { title, topic, difficulty, content, userSolution, inputOutput } =
    useProblemStore(state => ({
      title: state.title,
      topic: state.topic,
      difficulty: state.difficulty,
      content: state.content,
      userSolution: state.userSolution,
      inputOutput: state.inputOutput,
    }))

  const email = session?.user?.email
  const userId = session?.user?.id

  const runCode = useCallback(async () => {
    setProblemSolved(false)
    setFeedback(null)
    const problemData = { inputOutput, userSolution }
    setResults([])
    try {
      const response = await fetch('/api/executeCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemData }),
      })
      const data = await response.json()
      setResults(
        data.error ? [{ error: data.error } as TestResult] : data.results,
      )
    } catch (error) {
      console.error('Code execution error:', error)
      setResults([{ error: 'Code execution failed' } as TestResult])
    }
  }, [inputOutput, userSolution])

  const formatResult = (value: any) =>
    Array.isArray(value) ? JSON.stringify(value) : value

  const submitToAI = useCallback(async () => {
    setLoadingFeedback(true)
    setFeedback(null)
    try {
      const feedbackResponse = await generateFeedback(content, userSolution)
      setFeedback(feedbackResponse)
    } catch (error) {
      console.error('Feedback generation error:', error)
      setFeedback({
        timeComplexity: '',
        feedback: { efficiency: '', readability: '' },
        aiImprovedCode: '',
        error: 'AI 피드백 생성에 실패했습니다.',
      })
    } finally {
      setLoadingFeedback(false)
    }
  }, [content, userSolution])

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

  return (
    <div>
      <div className="flex items-center gap-4">
        <button onClick={runCode} className="w-28 rounded-sm bg-violet-600">
          채점하기
        </button>
        {results.length > 0 && results.every(result => result.passed) && (
          <button
            onClick={submitToAI}
            disabled={isLoadingFeedback}
            className={clsx(
              'w-36 rounded-sm',
              isLoadingFeedback ? 'bg-gray-400' : 'bg-fuchsia-700',
              'text-white',
            )}>
            {isLoadingFeedback ? 'Loading...' : 'AI에게 피드백 받기'}
          </button>
        )}
      </div>
      <div>
        {isLoadingFeedback ? (
          <Skeleton className="h-80 w-auto md:w-5/6" />
        ) : feedback ? (
          <Feedback {...feedback} />
        ) : (
          <ResultDisplay results={results} formatResult={formatResult} />
        )}
      </div>
    </div>
  )
}
