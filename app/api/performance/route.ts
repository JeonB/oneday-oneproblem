import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authoptions'
import { performanceMonitor } from '@/lib/performance'
import { logger, createRequestContext } from '@/lib/logger'
import { z } from 'zod'

const QuerySchema = z.object({
  operation: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export async function GET(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('Performance stats request received', context)

  try {
    // Check authentication (admin only)
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      logger.warn('Unauthorized performance stats request', context)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = req.nextUrl
    const parsed = QuerySchema.safeParse({
      operation: searchParams.get('operation'),
      limit: searchParams.get('limit'),
    })

    if (!parsed.success) {
      logger.warn('Invalid query parameters for performance stats', context)
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 },
      )
    }

    const { operation, limit } = parsed.data

    // Get performance statistics
    const stats = performanceMonitor.getStats(operation)

    // Limit results if specified
    const limitedStats = limit ? stats.slice(0, limit) : stats

    logger.info('Performance stats retrieved successfully', {
      ...context,
      operation,
      statsCount: limitedStats.length,
    })

    return NextResponse.json({
      stats: limitedStats,
      timestamp: Date.now(),
      total: stats.length,
    })
  } catch (error) {
    logger.error(
      'Failed to retrieve performance stats',
      error as Error,
      context,
    )
    return NextResponse.json(
      { error: 'Failed to retrieve performance statistics' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('Performance metrics reset request received', context)

  try {
    // Check authentication (admin only)
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      logger.warn('Unauthorized performance metrics reset request', context)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Reset performance metrics
    performanceMonitor.reset()

    logger.info('Performance metrics reset requested', {
      ...context,
      userId: session.user.email,
    })

    return NextResponse.json({
      message: 'Performance metrics reset successfully',
      timestamp: Date.now(),
    })
  } catch (error) {
    logger.error('Failed to reset performance metrics', error as Error, context)
    return NextResponse.json(
      { error: 'Failed to reset performance metrics' },
      { status: 500 },
    )
  }
}
