import Algorithms, { Algorithm } from '@/app/lib/models/Algorithms'
import { connectDB } from '@/app/lib/connecter'
import { startSession } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

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
  const { testalgorithms } = await req.json()

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

    await Algorithms.insertMany(newAlgorithms, { session })
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
  const { name, topic, img } = await req.json()

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
