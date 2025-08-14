import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'
import { AiGeneratedContent } from '@/components/context/Store'

// JSON 문자열 유효성 검사 함수
const isValidJson = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

// AI가 생성한 테스트 케이스 파싱
const parseTestCases = (aiGeneratedContent: AiGeneratedContent[]) => {
  return aiGeneratedContent.slice(1).map(({ input, output }) => {
    if (!input || !output) {
      throw new Error(
        'Invalid AI generated content: input or output is missing',
      )
    }

    const parsedInput = Array.isArray(input)
      ? input.map(item => (isValidJson(item) ? JSON.parse(item) : item))
      : [isValidJson(input as string) ? JSON.parse(input as string) : input]

    const parsedOutput = isValidJson(output as string)
      ? JSON.parse(output as string)
      : output

    return { input: parsedInput, output: parsedOutput }
  })
}

// 깊은 비교 함수 (배열 포함)
const deepEqual = (a: any, b: any): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((val, index) => deepEqual(val, b[index]))
    )
  }
  return a === b
}

const MAX_CODE_LENGTH = 10000
const MAX_TESTS = 50
const FORBIDDEN_TOKENS = [
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

const AiGeneratedContentSchema = z.object({
  input: z.union([z.array(z.string()), z.string()]),
  output: z.union([z.string(), z.array(z.string())]).optional(),
})

const BodySchema = z.object({
  problemData: z.object({
    userSolution: z.string().min(1).max(MAX_CODE_LENGTH),
    inputOutput: z.array(AiGeneratedContentSchema).max(MAX_TESTS),
  }),
})

const hasForbiddenTokens = (code: string): string | null => {
  const lower = code.toLowerCase()
  for (const token of FORBIDDEN_TOKENS) {
    if (lower.includes(token.toLowerCase())) return token
  }
  return null
}

const ensureSolutionDefined = (code: string) => {
  const hasNamedFn = /function\s+solution\s*\(/.test(code)
  const hasAssigned =
    /const\s+solution\s*=\s*/.test(code) ||
    /let\s+solution\s*=\s*/.test(code) ||
    /var\s+solution\s*=\s*/.test(code)
  if (!hasNamedFn && !hasAssigned) {
    throw new Error('A function named "solution" must be defined in your code.')
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      )
    }

    const { userSolution, inputOutput } = parsed.data.problemData

    const forbidden = hasForbiddenTokens(userSolution)
    if (forbidden) {
      return NextResponse.json(
        { error: `Usage of "${forbidden}" is not allowed.` },
        { status: 400 },
      )
    }

    ensureSolutionDefined(userSolution)

    // AI가 제공한 테스트 케이스 파싱
    const testCases = parseTestCases(
      inputOutput as unknown as {
        input: string | string[]
        output: string | string[]
      }[],
    )

    // 사용자 코드를 실행 가능한 함수로 변환
    const wrappedCode = `
    "use strict";
    ${userSolution}
    return solution;
  `
    const solutionFunction = new Function(wrappedCode)
    const solution = solutionFunction()

    if (typeof solution !== 'function') {
      throw new Error('The provided solution is not a valid function.')
    }

    const results = [] as Array<{
      input: any
      output: any
      result: any
      passed: boolean
      logs: string[]
      error?: string
    }>

    let totalMs = 0
    const MAX_TOTAL_MS = 2000

    for (const { input, output } of testCases) {
      const start = Date.now()
      try {
        const testCode = `
        const capturedLogs = [];
        const originalConsoleLog = console.log;

        console.log = function (...args) {
          capturedLogs.push(args.join(" "));
          originalConsoleLog.apply(console, args);
        };

        const result = solution(...${JSON.stringify(input)});

        console.log = originalConsoleLog;
        return { result, capturedLogs };
      `
        const testFunction = new Function('solution', testCode)
        const { result, capturedLogs } = testFunction(solution)
        results.push({
          input,
          output,
          result,
          passed: deepEqual(result, output),
          logs: capturedLogs,
        })
      } catch (error) {
        results.push({
          input,
          output,
          result: null,
          passed: false,
          logs: [],
          error: (error as Error).message,
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

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
