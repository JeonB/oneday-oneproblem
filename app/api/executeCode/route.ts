import { NextRequest, NextResponse } from 'next/server'
import { AiGeneratedContent } from '@/components/context/StoreContext'

// AI가 생성한 테스트 케이스 파싱
export const parseTestCases = (aiGeneratedContent: AiGeneratedContent[]) => {
  const testCases: { input: any[]; output: any }[] = []

  const content = aiGeneratedContent.slice(1)
  content.forEach(example => {
    const input = Array.isArray(example.input)
      ? example.input.map(item => JSON.parse(item))
      : [JSON.parse(example.input as string)]

    const output = JSON.parse(example.output as string)
    testCases.push({ input, output })
  })

  return testCases
}

// 추가적인 테스트 케이스 생성
export const generateDynamicTestCases = (
  constraints: { min: number; max: number; length: number },
  solution: (...args: any[]) => any,
) => {
  const dynamicTestCases: { input: any[]; output: any }[] = []

  for (let i = 0; i < 5; i++) {
    // 입력값 생성
    const length = Math.floor(Math.random() * (constraints.length - 1)) + 1
    const input = Array.from(
      { length },
      () =>
        Math.floor(Math.random() * (constraints.max - constraints.min)) +
        constraints.min,
    )

    // 정답 생성
    const output = solution(input)

    dynamicTestCases.push({ input: [input], output })
  }

  return dynamicTestCases
}

// 깊은 비교 함수 (배열 포함)
export const deepEqual = (a: any, b: any): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((val, index) => deepEqual(val, b[index]))
    )
  }
  return a === b
}

export async function POST(req: NextRequest) {
  const { code, aiGeneratedContent, constraints } = await req.json()

  // AI가 제공한 테스트 케이스 파싱
  const testCases = parseTestCases(aiGeneratedContent)

  const wrappedCode = `
    ${code}
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
    const dynamicTestCases = generateDynamicTestCases(constraints, solution)
    for (const { input, output } of dynamicTestCases) {
      const result = solution(...input)
      const passed = deepEqual(result, output)
      results.push({ input, output, result, passed })
    }

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
