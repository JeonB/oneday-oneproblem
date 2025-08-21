import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authoptions'
import { getClientIdFromRequest, rateLimit } from '@/app/lib/rateLimit'
import {
  algorithmQueries,
  cacheControl,
  withPerformanceMonitoring,
} from '@/lib/db'
import { logger, createRequestContext } from '@/lib/logger'
import { withEnhancedPerformanceMonitoring } from '@/lib/performance'

const AlgorithmSchema = z.object({
  name: z.string().min(1),
  topic: z.string().min(1),
  img: z.string().url().optional().or(z.literal('')).optional(),
})

const AlgorithmsArraySchema = z.array(AlgorithmSchema).min(1)

export async function GET(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('Algorithms list request received', context)

  try {
    const data = await withEnhancedPerformanceMonitoring(
      'getAllAlgorithms',
      () => algorithmQueries.findAll(),
      { metadata: { endpoint: 'GET' } },
    )

    logger.info('Algorithms list retrieved successfully', {
      ...context,
      algorithmsCount: data.length,
    })

    return NextResponse.json(data, {
      status: 200,
      headers: cacheControl.long,
    })
  } catch (error) {
    logger.error('Failed to fetch algorithms', error as Error, context)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('Algorithms bulk insert request received', context)

  const userSession = await getServerSession(authOptions)
  if (!userSession) {
    logger.warn('Unauthorized algorithms insert attempt', context)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = AlgorithmsArraySchema.safeParse(body?.testalgorithms)
  if (!parsed.success) {
    logger.warn('Invalid algorithms payload', context)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const testalgorithms = parsed.data

  try {
    const result = await withEnhancedPerformanceMonitoring(
      'bulkInsertAlgorithms',
      () => algorithmQueries.bulkInsert(testalgorithms),
      {
        userId: userSession.user?.id,
        metadata: {
          endpoint: 'POST',
          algorithmsCount: testalgorithms.length,
        },
      },
    )

    logger.info('Algorithms bulk insert completed', {
      ...context,
      insertedCount: result.length,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    logger.error('Failed to add algorithms', error as Error, context)
    return NextResponse.json(
      { error: 'Failed to add algorithms' },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('Algorithm update request received', context)

  const session = await getServerSession(authOptions)
  if (!session) {
    logger.warn('Unauthorized algorithm update attempt', context)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = AlgorithmSchema.safeParse(await req.json())
  if (!parsed.success) {
    logger.warn('Invalid algorithm update payload', context)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { name, topic, img } = parsed.data

  try {
    await withEnhancedPerformanceMonitoring(
      'updateAlgorithm',
      async () => {
        const algorithm = await algorithmQueries.findByNames([name])
        if (!algorithm.length) {
          throw new Error('해당 알고리즘 없음')
        }

        return await algorithmQueries.updateAlgorithm(name, { topic, img })
      },
      {
        userId: session.user?.id,
        metadata: {
          endpoint: 'PUT',
          algorithmName: name,
        },
      },
    )

    logger.info('Algorithm updated successfully', {
      ...context,
      algorithmName: name,
    })
    return NextResponse.json(
      { message: 'Algorithm updated successfully' },
      { status: 200 },
    )
  } catch (error) {
    logger.error('Failed to update algorithm', error as Error, context)
    if (error instanceof Error && error.message === '해당 알고리즘 없음') {
      return NextResponse.json({ error: '해당 알고리즘 없음' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Failed to update Algorithm' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('Algorithms delete request received', context)

  const id = getClientIdFromRequest(req)
  const rl = rateLimit({ id, capacity: 5, refillPerSec: 1 })
  if (!rl.allowed) {
    logger.warn('Rate limit exceeded for algorithms delete', {
      ...context,
      clientId: id,
    })
    return NextResponse.json(
      { error: 'Too Many Requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  const session = await getServerSession(authOptions)
  if (!session) {
    logger.warn('Unauthorized algorithms delete attempt', context)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await withEnhancedPerformanceMonitoring(
      'deleteAllAlgorithms',
      () => algorithmQueries.deleteAll(),
      {
        userId: session.user?.id,
        metadata: { endpoint: 'DELETE' },
      },
    )

    logger.info('All algorithms deleted successfully', context)
    return NextResponse.json(
      { message: 'All algorithms deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    logger.error('Failed to delete algorithms', error as Error, context)
    return NextResponse.json(
      { error: 'Failed to delete algorithms' },
      { status: 500 },
    )
  }
}
