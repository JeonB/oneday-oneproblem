import { useCallback, useRef, useState } from 'react'

interface TestCase {
  input: any[]
  output: any
}

interface ExecutionResult {
  input: any
  output: any
  result: any
  passed: boolean
  logs: string[]
  error?: string
}

interface UseCodeExecutionReturn {
  executeCode: (
    code: string,
    testCases: TestCase[],
    timeout?: number,
  ) => Promise<{
    results: ExecutionResult[]
    error: string | null
  }>
  isExecuting: boolean
}

export function useCodeExecution(): UseCodeExecutionReturn {
  const [isExecuting, setIsExecuting] = useState(false)
  const workerRef = useRef<Worker | null>(null)

  const executeCode = useCallback(
    async (code: string, testCases: TestCase[], timeout = 2000) => {
      setIsExecuting(true)

      try {
        // Create worker if not exists
        if (!workerRef.current) {
          workerRef.current = new Worker('/codeWorker.js')
        }

        return new Promise<{
          results: ExecutionResult[]
          error: string | null
        }>(resolve => {
          const id = Date.now().toString()

          const handleMessage = (e: MessageEvent) => {
            if (e.data.id === id) {
              workerRef.current?.removeEventListener('message', handleMessage)
              setIsExecuting(false)
              resolve({
                results: e.data.results || [],
                error: e.data.error || null,
              })
            }
          }

          workerRef.current?.addEventListener('message', handleMessage)

          workerRef.current?.postMessage({
            id,
            code,
            testCases,
            timeout,
          })
        })
      } catch (error) {
        setIsExecuting(false)
        return {
          results: [],
          error: (error as Error).message,
        }
      }
    },
    [],
  )

  return { executeCode, isExecuting }
}
