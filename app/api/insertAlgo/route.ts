import Algorithms from '@/app/lib/models/Algorithms'
import { connectDB } from '@/app/lib/connecter'
import { startSession } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  await connectDB()
  try {
    const data = await Algorithms.find({}).lean()
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
  const { algorithms } = await req.json()

  const session = await startSession()
  session.startTransaction()

  try {
    const existingAlgorithms = await Algorithms.find({
      name: { $in: algorithms.map((algo: any) => algo.name) },
    }).session(session)

    const existingNames = new Set(
      existingAlgorithms.map((algo: any) => algo.name),
    )
    const newAlgorithms = algorithms.filter(
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
  const { year, eventId, date, description } = await req.json()

  try {
    const algorithms = await Algorithms.findOne({ year })
    if (!algorithms) {
      return NextResponse.json({ error: 'Year not found' }, { status: 404 })
    } else {
      const event = algorithms.events.id(eventId)
      if (event) {
        event.date = date
        event.description = description
        await algorithms.save()
        return NextResponse.json(
          { message: 'Event updated successfully' },
          { status: 200 },
        )
      } else {
        return NextResponse.json(
          { message: 'Event not found' },
          { status: 404 },
        )
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 },
    )
  }
}
