// Web Worker for safe code execution
self.onmessage = function (e) {
  const { id, code, testCases, timeout = 2000 } = e.data

  try {
    // Validate code for forbidden tokens
    const forbiddenTokens = [
      'process',
      'require',
      'global',
      'globalThis',
      'window',
      'eval',
      'Function(',
      'WebAssembly',
      'import(',
      'XMLHttpRequest',
      'navigator',
      'fetch',
    ]

    const lowerCode = code.toLowerCase()
    for (const token of forbiddenTokens) {
      if (lowerCode.includes(token.toLowerCase())) {
        self.postMessage({
          id,
          error: `Usage of "${token}" is not allowed.`,
          results: null,
        })
        return
      }
    }

    // Ensure solution function is defined
    const hasNamedFn = /function\s+solution\s*\(/.test(code)
    const hasAssigned =
      /const\s+solution\s*=\s*/.test(code) ||
      /let\s+solution\s*=\s*/.test(code) ||
      /var\s+solution\s*=\s*/.test(code)

    if (!hasNamedFn && !hasAssigned) {
      self.postMessage({
        id,
        error: 'A function named "solution" must be defined in your code.',
        results: null,
      })
      return
    }

    // Create solution function
    const wrappedCode = `
      "use strict";
      ${code}
      return solution;
    `
    const solutionFunction = new Function(wrappedCode)
    const solution = solutionFunction()

    if (typeof solution !== 'function') {
      self.postMessage({
        id,
        error: 'The provided solution is not a valid function.',
        results: null,
      })
      return
    }

    // Run test cases
    const results = []
    let totalMs = 0
    const MAX_TOTAL_MS = timeout

    for (const testCase of testCases) {
      const start = Date.now()
      try {
        const { input, output } = testCase
        const capturedLogs = []
        const originalConsoleLog = console.log

        console.log = function (...args) {
          capturedLogs.push(args.join(' '))
          originalConsoleLog.apply(console, args)
        }

        const result = solution(...input)
        console.log = originalConsoleLog

        results.push({
          input,
          output,
          result,
          passed: deepEqual(result, output),
          logs: capturedLogs,
        })
      } catch (error) {
        results.push({
          input: testCase.input,
          output: testCase.output,
          result: null,
          passed: false,
          logs: [],
          error: error.message,
        })
      } finally {
        totalMs += Date.now() - start
        if (totalMs > MAX_TOTAL_MS) {
          results.push({
            input: [],
            output: null,
            result: null,
            passed: false,
            logs: [],
            error: 'Execution time limit exceeded',
          })
          break
        }
      }
    }

    self.postMessage({
      id,
      results,
      error: null,
    })
  } catch (error) {
    self.postMessage({
      id,
      error: error.message,
      results: null,
    })
  }
}

// Deep equality check for arrays and primitives
function deepEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((val, index) => deepEqual(val, b[index]))
    )
  }
  return a === b
}
