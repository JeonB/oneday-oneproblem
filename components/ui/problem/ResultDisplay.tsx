import clsx from 'clsx'

export type TestResult = {
  input: any[]
  output: any
  result: any
  passed: boolean
  error?: string
  logs?: string[]
}

type ResultDisplayProps = {
  results: TestResult[]
  formatResult: (value: any) => string
}

export const ResultDisplay = ({
  results,
  formatResult,
}: ResultDisplayProps) => {
  return (
    <div className="g-4 m-4 grid">
      {results.map((result, index) => (
        <div
          key={index}
          className={clsx(
            'relative m-4 h-fit rounded-lg border p-4 shadow-md transition-transform duration-200 md:w-3/5',
            result.passed
              ? 'border-green-300 bg-green-50 text-green-700 hover:scale-105'
              : 'border-red-300 bg-red-50 text-red-700 hover:scale-105',
          )}>
          {result.error ? (
            <p className="font-semibold">
              <span className="font-bold text-red-700">Error:</span>{' '}
              {result.error}
            </p>
          ) : (
            <div>
              <h4 className="mb-2 text-lg font-bold">Test Case {index + 1}</h4>
              <p>
                <span className="font-medium">기댓값:</span>{' '}
                <span className="font-mono">{formatResult(result.output)}</span>
              </p>
              <p>
                <span className="font-medium">입력값:</span>{' '}
                <span className="font-mono">{formatResult(result.result)}</span>
              </p>
              {result.logs && result.logs.length > 0 && (
                <div className="flex flex-col">
                  <div className="flex">
                    <span className="font-medium">출력: </span>
                    <div className="ml-2 flex flex-col">
                      <span className="font-mono">{result.logs[0]}</span>
                      {result.logs.slice(1, 10000).map((log, index) => (
                        <span key={index} className="font-mono">
                          {log}
                        </span>
                      ))}
                      {result.logs.length > 10000 && (
                        <span className="font-mono text-gray-500">
                          출력한 내용이 너무 깁니다.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <p className="mt-2">
                {result.passed ? (
                  <span className="rounded bg-green-200 px-2 py-1 text-sm font-semibold">
                    Passed
                  </span>
                ) : (
                  <span className="rounded bg-red-200 px-2 py-1 text-sm font-semibold">
                    Failed
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
