import { NextRequest, NextResponse } from 'next/server'

interface TestCase {
  input: string[]
  expected: string
}
// AI가 생성한 문제와 함께 제공된 테스트 케이스 예시를 가져옵니다
const parseTestCases = (aiGeneratedContent: string) => {
  const testCases: TestCase[] = []
  // AI가 제공한 입력 예시와 출력 예시를 파싱하는 로직을 구현합니다
  // 예: AI 응답 내용 중 "입력 예시"와 "출력 예시" 패턴을 기준으로 텍스트 파싱
  const inputExamples = aiGeneratedContent.match(
    /입력 예시.*\n([\s\S]*?)출력 예시.*\n([\s\S]*?)/g,
  )

  if (inputExamples) {
    inputExamples.forEach(example => {
      const input = example.match(/입력:\s*([\s\S]*?)\n/)
      const expectedOutput = example.match(/출력:\s*([\s\S]*?)\n/)
      if (input && expectedOutput) {
        testCases.push({
          input: input[1].trim().split('\n'),
          expected: expectedOutput[1].trim(),
        })
      }
    })
  }
  return testCases
}

export async function POST(req: NextRequest) {
  const { code, aiGeneratedProblem } = await req.json()

  // 동적으로 생성된 문제에서 테스트 케이스를 파싱합니다
  const testCases = parseTestCases(aiGeneratedProblem)

  // 사용자가 입력한 코드를 solution 함수로 설정
  const wrappedCode = `
    ${code}
    return solution;
  `

  try {
    const solution = new Function(wrappedCode)()
    const results = []

    // 각 테스트 케이스 실행
    for (const { input, expected } of testCases) {
      const result = solution(...input)
      results.push({
        input,
        expected,
        result,
        passed: result === expected,
      })
    }

    // 모든 테스트 결과 반환
    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
