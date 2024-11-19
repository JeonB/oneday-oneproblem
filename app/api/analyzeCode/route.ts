import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { generatedFeedback } = await req.json()
  console.log(generatedFeedback)
  try {
    const { timeComplexity, feedback, aiImprovedCode } =
      JSON.parse(generatedFeedback)

    const results = { timeComplexity, feedback, aiImprovedCode }
    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
