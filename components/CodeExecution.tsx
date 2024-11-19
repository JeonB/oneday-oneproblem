import { useState } from 'react'
import { useCode } from './context/CodeContext'
import generateFeedback from '@/app/utils/generateFeedback.mjs'

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
  const { code, aiGeneratedContent } = useCode()
  const [results, setResults] = useState<TestResult[]>([])
  const [feedback, setFeedback] = useState<Feedback>()
  const [isFeedbackOn, setFeedbackOn] = useState(false)
  const constraints = { min: -100000, max: 100000, length: 100 }

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
      console.log('데이터', data.results)
    }
    setFeedbackOn(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={runCode}
          style={{ backgroundColor: 'blueviolet', width: '7rem' }}>
          Run Code
        </button>
        {results.filter(result => result.passed === false).length === 0 && (
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
