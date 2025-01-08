import clsx from 'clsx'

export type TestResult = {
  input: any[]
  output: any
  result: any
  passed: boolean
  error?: string
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
    <div className="g-4 m-4 grid h-96 overflow-y-auto md:h-[15rem]">
      {results.map((result, index) => (
        <div
          key={index}
          className={clsx(
            'relative m-4 rounded-lg border p-4 shadow-md transition-transform duration-200 md:h-36 md:w-3/5',
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
                <span className="font-medium">Expected:</span>{' '}
                <span className="font-mono">{formatResult(result.output)}</span>
              </p>
              <p>
                <span className="font-medium">Got:</span>{' '}
                <span className="font-mono">{formatResult(result.result)}</span>
              </p>
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
