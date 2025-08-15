import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getClientIdFromRequest, rateLimit } from '@/app/lib/rateLimit'

export async function POST(req: NextRequest) {
  const id = getClientIdFromRequest(req)
  const rl = rateLimit({ id, capacity: 30, refillPerSec: 10 })
  if (!rl.allowed)
    return NextResponse.json(
      { error: 'Too Many Requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )

  const BodySchema = z.object({
    generatedFeedback: z.string().min(2),
  })
  const parsed = BodySchema.safeParse(await req.json())
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const { generatedFeedback } = parsed.data
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
