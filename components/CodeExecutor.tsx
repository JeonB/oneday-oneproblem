'use client'

import React, { useState } from 'react'
import { useCodeExecution } from '@/hooks/useCodeExecution'
import { ErrorBoundary } from './ErrorBoundary'

interface TestCase {
  input: any[]
  output: any
}

interface CodeExecutorProps {
  initialCode?: string
  testCases: TestCase[]
  onResult?: (results: any) => void
  onError?: (error: string) => void
}

export function CodeExecutor({
  initialCode = '',
  testCases,
  onResult,
  onError,
}: CodeExecutorProps) {
  const [code, setCode] = useState(initialCode)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const { executeCode, isExecuting } = useCodeExecution()

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to execute')
      return
    }

    setError(null)
    setResults([])

    try {
      const { results: executionResults, error: executionError } =
        await executeCode(
          code,
          testCases,
          2000, // 2 second timeout
        )

      if (executionError) {
        setError(executionError)
        onError?.(executionError)
      } else {
        setResults(executionResults)
        onResult?.(executionResults)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      onError?.(errorMessage)
    }
  }

  const getPassedCount = () => {
    return results.filter(result => result.passed).length
  }

  const getFailedCount = () => {
    return results.filter(result => !result.passed).length
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {/* Code Editor */}
        <div>
          <label
            htmlFor="code"
            className="mb-2 block text-sm font-medium text-gray-700">
            Your Solution
          </label>
          <textarea
            id="code"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="function solution(...args) {&#10;  // Your code here&#10;  return result;&#10;}"
            className="h-64 w-full rounded-md border border-gray-300 p-4 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            disabled={isExecuting}
          />
        </div>

        {/* Run Button */}
        <div>
          <button
            onClick={handleRunCode}
            disabled={isExecuting || !code.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <pre className="whitespace-pre-wrap">{error}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Results:
                </span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {getPassedCount()} passed
                </span>
                {getFailedCount() > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    {getFailedCount()} failed
                  </span>
                )}
              </div>
            </div>

            {/* Test Cases */}
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`rounded-md border p-4 ${
                    result.passed
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Test Case {index + 1}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        result.passed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                    <div>
                      <span className="font-medium text-gray-700">Input:</span>
                      <pre className="mt-1 overflow-auto rounded bg-gray-100 p-2 text-xs">
                        {JSON.stringify(result.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Expected:
                      </span>
                      <pre className="mt-1 overflow-auto rounded bg-gray-100 p-2 text-xs">
                        {JSON.stringify(result.output, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Output:</span>
                      <pre className="mt-1 overflow-auto rounded bg-gray-100 p-2 text-xs">
                        {result.error ? (
                          <span className="text-red-600">{result.error}</span>
                        ) : (
                          JSON.stringify(result.result, null, 2)
                        )}
                      </pre>
                    </div>
                  </div>

                  {/* Console Logs */}
                  {result.logs && result.logs.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">
                        Console Output:
                      </span>
                      <pre className="mt-1 overflow-auto rounded bg-gray-100 p-2 text-xs">
                        {result.logs.join('\n')}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
