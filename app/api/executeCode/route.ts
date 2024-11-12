import { NextRequest, NextResponse } from 'next/server'
import { AiGeneratedContent } from '@/components/context/CodeContext'

const parseTestCases = (aiGeneratedContent: AiGeneratedContent[]) => {
  const testCases: { input: any[]; output: any }[] = []

  const content = aiGeneratedContent.slice(1)
  content.forEach(example => {
    // Parse input as JSON array to handle multiple inputs dynamically
    const input = Array.isArray(example.input)
      ? example.input.map(item => JSON.parse(item))
      : JSON.parse(example.input as string)

    // Parse output as JSON to handle either array or primitive types
    const output = Array.isArray(example.output)
      ? example.output.map(item => JSON.parse(item))
      : JSON.parse(example.output as string)

    testCases.push({ input, output })
  })

  return testCases
}

// Helper function to compare arrays for test case results
const arraysEqual = (a: any[], b: any[]) =>
  a.length === b.length && a.every((val, index) => val === b[index])

export async function POST(req: NextRequest) {
  const { code, aiGeneratedContent } = await req.json()
  const testCases = parseTestCases(aiGeneratedContent)

  const wrappedCode = `
    ${code}
    return solution;
  `

  try {
    const solution = new Function(wrappedCode)()
    const results = []

    for (const { input, output } of testCases) {
      // Use the spread operator to pass multiple arguments to solution
      const result = solution(...input)

      const passed = Array.isArray(output)
        ? arraysEqual(result, output)
        : result === output

      results.push({
        input,
        output,
        result,
        passed,
      })
    }

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
