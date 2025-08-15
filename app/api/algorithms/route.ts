import Algorithms, { Algorithm } from '@/app/lib/models/Algorithms'
import { connectDB } from '@/app/lib/connecter'
import { startSession } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authoptions'
import { getClientIdFromRequest, rateLimit } from '@/app/lib/rateLimit'

const AlgorithmSchema = z.object({
  name: z.string().min(1),
  topic: z.string().min(1),
  img: z.string().url().optional().or(z.literal('')).optional(),
})

const AlgorithmsArraySchema = z.array(AlgorithmSchema).min(1)

export async function GET(req: NextRequest) {
  await connectDB()
  try {
    const data: Algorithm[] = (await Algorithms.find({}).lean()).map(
      (algo: any) => ({
        name: algo.name,
        topic: algo.topic,
        img: algo.img,
      }),
    )
    const headers = {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    }
    return NextResponse.json(data, { status: 200, headers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  await connectDB()
  const userSession = await getServerSession(authOptions)
  if (!userSession)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = AlgorithmsArraySchema.safeParse(body?.testalgorithms)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const testalgorithms = parsed.data

  const session = await startSession()
  session.startTransaction()

  try {
    const existingAlgorithms: Algorithm[] = await Algorithms.find({
      name: { $in: testalgorithms.map((algo: any) => algo.name) },
    }).session(session)

    const existingNames = new Set(
      existingAlgorithms.map((algo: any) => algo.name),
    )
    const newAlgorithms = testalgorithms.filter(
      (algo: any) => !existingNames.has(algo.name),
    )

    if (newAlgorithms.length === 0) {
      await session.abortTransaction()
      session.endSession()
      return NextResponse.json(
        { error: 'All algorithms already exist' },
        { status: 409 },
      )
    }

    try {
      await Algorithms.insertMany(newAlgorithms, { session, ordered: false })
    } catch (e: any) {
      // ignore duplicate key errors on unordered inserts
      if (e?.writeErrors?.every((we: any) => we?.code === 11000) !== true) {
        throw e
      }
    }
    await session.commitTransaction()
    session.endSession()
    return NextResponse.json(newAlgorithms, { status: 201 })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return NextResponse.json(
      { error: 'Failed to add algorithms' },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  await connectDB()
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = AlgorithmSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const { name, topic, img } = parsed.data

  try {
    const algorithm: Algorithm | null = await Algorithms.findOne({ name })
    if (!algorithm) {
      return NextResponse.json({ error: '해당 알고리즘 없음' }, { status: 404 })
    } else {
      await Algorithms.updateOne({ name }, { topic, img })
      return NextResponse.json(
        { message: 'Algorithm updated successfully' },
        { status: 200 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update Algorithm' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB()
  const id = getClientIdFromRequest(req)
  const rl = rateLimit({ id, capacity: 5, refillPerSec: 1 })
  if (!rl.allowed)
    return NextResponse.json(
      { error: 'Too Many Requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )

  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await Algorithms.deleteMany({})
    return NextResponse.json(
      { message: 'All algorithms deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete algorithms' },
      { status: 500 },
    )
  }
}
