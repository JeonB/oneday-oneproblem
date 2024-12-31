import { useEffect, useState } from 'react'
import { useStore } from '../../context/StoreContext'
import generateFeedback from '@/app/lib/generateFeedback.mjs'
import { useSession } from 'next-auth/react'

type TestResult = {
  input: any[]
  output: any
  result: any
  passed: boolean
  error?: string
}

type Feedback = {
  timeComplexity: string
  feedback: { efficiency: string; readability: string }
  aiImprovedCode: string
  error?: string
}

export default function CodeExecution() {
  const { code, aiGeneratedContent } = useStore()
  const [results, setResults] = useState<TestResult[]>([])
  const [feedback, setFeedback] = useState<Feedback>()
  const [isFeedbackOn, setFeedbackOn] = useState(false)
  const constraints = { min: -100000, max: 100000, length: 100 }
  const { data: session } = useSession()

  const runCode = async () => {
    setResults([])
    const response = await fetch('/api/executeCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, aiGeneratedContent, constraints }),
    })
    const data = await response.json()
    if (data.error) {
      setResults([{ error: data.error } as TestResult])
    } else {
      setResults(data.results)
    }
  }

  const formatResult = (value: any) =>
    Array.isArray(value) ? JSON.stringify(value) : value

  const submitToAI = async () => {
    const feedback = await generateFeedback(code as string)
    const generatedFeedback = feedback?.replace(/```json|```/g, '')

    const response = await fetch('/api/analyzeCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generatedFeedback }),
    })

    const data = await response.json()
    if (data.error) {
      setFeedback({ error: data.error } as Feedback)
    } else {
      setFeedback(data.results)
    }
    setFeedbackOn(true)
  }

  useEffect(() => {
    if (
      results.length > 0 &&
      results.filter(result => result.passed === false).length === 0
    ) {
      const handleProblemSolve = async () => {
        const email = session?.user?.email
        console.log('이메일', email)
        try {
          const response = await fetch(`/api/problemSolved`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })

          if (response.ok) {
            const data = await response.json()
            console.log('streak: ', data.streak)
            alert('문제를 성공적으로 풀었습니다!')
          } else {
            throw new Error('문제 풀이 업데이트에 실패했습니다.')
          }
        } catch (error) {
          console.error(error)
          alert('문제를 푸는 데 실패했습니다.')
        }
      }
      handleProblemSolve()
    }
  }, [results, session?.user?.email])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={runCode}
          style={{ backgroundColor: 'blueviolet', width: '7rem' }}>
          Run Code
        </button>
        {results.length > 0 &&
          results.filter(result => result.passed === false).length === 0 && (
            <button
              onClick={submitToAI}
              style={{ backgroundColor: 'darkmagenta', width: '9rem' }}>
              AI에게 피드백 받기
            </button>
          )}
      </div>
      <div>
        {feedback && isFeedbackOn ? (
          <div>
            <p>시간 복잡도: {feedback.timeComplexity}</p>
            <p>효율성: {feedback.feedback.efficiency}</p>
            <p>가독성: {feedback.feedback.readability}</p>
            <p>개선된 코드:</p>
            <pre>{feedback.aiImprovedCode}</pre>
          </div>
        ) : (
          results.map((result, index) => (
            <div key={index} style={{ color: result.passed ? 'green' : 'red' }}>
              {result.error ? (
                <p>Error: {result.error}</p>
              ) : (
                <p>
                  Test Case {index + 1}: Expected ={' '}
                  {formatResult(result.output)}, Got ={' '}
                  {formatResult(result.result)},{' '}
                  {result.passed ? 'Passed' : 'Failed'}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
