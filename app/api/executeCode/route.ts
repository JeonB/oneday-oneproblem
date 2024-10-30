import { NextRequest, NextResponse } from 'next/server'

// 샘플 테스트 케이스
const testCases = [
  { X: '100', Y: '2345', expected: '-1' },
  { X: '100', Y: '203045', expected: '0' },
  { X: '100', Y: '123450', expected: '10' },
  { X: '12321', Y: '42531', expected: '321' },
]

export async function POST(req: NextRequest) {
  const { code } = await req.json()

  // 사용자가 입력한 코드를 solution 함수로 설정
  const wrappedCode = `
   ${code} return solution;
  `

  try {
    const solution = new Function(wrappedCode)()
    const results = []
    // 테스트 케이스 실행
    for (const { X, Y, expected } of testCases) {
      const result = solution(X, Y)
      results.push({
        X,
        Y,
        expected,
        result,
        passed: result === expected,
      })
    }

    // 모든 테스트 통과
    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
