import { useState } from 'react'
import { useCode } from './context/CodeContext'

type TestResult = {
  input: any[]
  output: any
  result: any
  passed: boolean
  error?: string
}

export default function CodeExecution() {
  const { code, aiGeneratedContent } = useCode()
  const [results, setResults] = useState<TestResult[]>([])
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
                Test Case {index + 1}: Expected = {formatResult(result.output)},
                Got = {formatResult(result.result)},{' '}
                {result.passed ? 'Passed' : 'Failed'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
