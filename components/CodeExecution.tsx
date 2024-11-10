import { useState } from 'react'
import { useCode } from './context/CodeContext'
interface TestResult {
  X: string
  Y: string
  expected: string
  result: string
  passed: boolean
  error?: string
}
export default function CodeExecution() {
  const { code, aiGeneratedContent } = useCode()
  const [results, setResults] = useState<TestResult[]>([])

  const runCode = async () => {
    setResults([])
    const response = await fetch('/api/executeCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, aiGeneratedContent }),
    })
    const data = await response.json()
    if (data.error) {
      setResults([{ error: data.error } as TestResult])
    } else {
      setResults(data.results)
    }
  }

  return (
    <div>
      <button
        onClick={runCode}
        style={{ backgroundColor: 'blueviolet', width: '7rem' }}>
        Run Code
      </button>
      <div>
        {results.map((result, index) => (
          <div key={index} style={{ color: result.passed ? 'green' : 'red' }}>
            {result.error ? (
              <p>Error: {result.error}</p>
            ) : (
              <p>
                Test Case {index + 1}: X = {result.X}, Y = {result.Y}, Expected
                = {result.expected}, Got = {result.result}, Passed ={' '}
                {result.passed ? 'Yes' : 'No'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
