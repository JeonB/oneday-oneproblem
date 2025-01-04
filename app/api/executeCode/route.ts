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
  const testCases: { input: any[]; output: any }[] = []

  try {
    const content = aiGeneratedContent.slice(1)
    content.forEach(example => {
      if (!example.input || !example.output) {
        throw new Error(
          'Invalid AI generated content: input or output is missing',
        )
      }

      const input = Array.isArray(example.input)
        ? example.input.map(item =>
            isValidJson(item) ? JSON.parse(item) : item,
          )
        : [
            isValidJson(example.input as string)
              ? JSON.parse(example.input as string)
              : example.input,
          ]

      const output = isValidJson(example.output as string)
        ? JSON.parse(example.output as string)
        : example.output
      testCases.push({ input, output })
    })
  } catch (e) {
    console.error(e)
  }

  return testCases
}

// 추가적인 테스트 케이스 생성
const generateDynamicTestCases = (
  constraints: { min: number; max: number; length: number },
  solution: (...args: any[]) => any,
) => {
  const dynamicTestCases: { input: any[]; output: any }[] = []

  for (let i = 0; i < 5; i++) {
    // 입력값 생성
    const length = Math.floor(Math.random() * constraints.length) + 1 // 길이 제한 설정
    const input = Array.from(
      { length },
      () =>
        Math.floor(Math.random() * (constraints.max - constraints.min + 1)) +
        constraints.min,
    )

    // 정답 생성
    const output = solution(input)

    dynamicTestCases.push({ input: [input], output })
  }

  return dynamicTestCases
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
  const { userSolution, inputOutput, constraints } = problemData

  // AI가 제공한 테스트 케이스 파싱
  const testCases = parseTestCases(inputOutput)

  const wrappedCode = `
    ${userSolution}
    return solution;
  `

  try {
    // 사용자 제출 코드를 함수로 변환
    const solution = new Function(wrappedCode)()

    // 기존 테스트 케이스 검증
    const results = []
    for (const { input, output } of testCases) {
      const result = solution(...input)
      const passed = deepEqual(result, output)
      results.push({ input, output, result, passed })
    }

    // 내부적으로 동적 테스트 케이스 생성 및 검증
    // const dynamicTestCases = generateDynamicTestCases(constraints, solution)
    // for (const { input, output } of dynamicTestCases) {
    //   const result = solution(...input)
    //   const passed = deepEqual(result, output)
    //   results.push({ input, output, result, passed })
    // }

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
