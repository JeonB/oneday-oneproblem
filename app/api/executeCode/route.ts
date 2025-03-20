import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(req: NextRequest) {
  const { problemData } = await req.json()
  const { userSolution, inputOutput } = problemData

  try {
    // AI가 제공한 테스트 케이스 파싱
    const testCases = parseTestCases(inputOutput)

    // 사용자 코드를 실행 가능한 함수로 변환
    const wrappedCode = `
    ${userSolution}
    return solution;
  `
    const solutionFunction = new Function(wrappedCode)

    const solution = solutionFunction() // 반환된 solution 함수
    if (typeof solution !== 'function') {
      throw new Error('The provided solution is not a valid function.')
    }
    // 테스트 케이스 검증
    const results = testCases.map(({ input, output }) => {
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

        return {
          input,
          output,
          result,
          passed: deepEqual(result, output),
          logs: capturedLogs,
        }
      } catch (error) {
        return {
          input,
          output,
          result: null,
          passed: false,
          logs: [],
          error: (error as Error).message,
        }
      }
    })

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
