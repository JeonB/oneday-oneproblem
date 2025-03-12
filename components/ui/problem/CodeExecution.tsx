'use client'
import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useProblemStore } from '@/components/context/StoreContext'
import generateFeedback from '@/app/lib/generateFeedback'
import clsx from 'clsx'
import { Feedback, FeedbackState } from './Feedback'
import { TestResult, ResultDisplay } from './ResultDisplay'
import { Skeleton } from '@/components/ui/skeleton'
import { AiGeneratedContent } from '@/components/context/Store'
import { useProblemSolve } from '@/hooks/useProblemSolve'

export default function CodeExecution({
  inputOutput,
}: {
  inputOutput: AiGeneratedContent[]
}) {
  const [results, setResults] = useState<TestResult[]>([])
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [isLoadingFeedback, setLoadingFeedback] = useState(false)
  const { data: session } = useSession()
  const { content, userSolution } = useProblemStore(state => state)

  const email = session?.user?.email
  const userId = session?.user?.id

  const runCode = useCallback(async () => {
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

  useProblemSolve({ email, userId, results })

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
