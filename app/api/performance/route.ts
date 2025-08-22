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

// Health check endpoint for monitoring systems
export async function HEAD(req: NextRequest) {
  const context = createRequestContext(req)

  try {
    const healthStatus = performanceMonitor.getHealthStatus()

    const status = healthStatus.healthy ? 200 : 503
    const headers: Record<string, string> = {
      'X-Health-Status': healthStatus.healthy ? 'healthy' : 'unhealthy',
      'X-Error-Rate': healthStatus.summary.errorRate.toFixed(4),
      'X-Avg-Response-Time': healthStatus.summary.avgResponseTime.toFixed(0),
      'X-Total-Operations': healthStatus.summary.totalOperations.toString(),
    }

    if (healthStatus.warnings.length > 0) {
      headers['X-Warnings'] = healthStatus.warnings.join(', ')
    }

    if (healthStatus.critical.length > 0) {
      headers['X-Critical'] = healthStatus.critical.join(', ')
    }

    logger.info('Health check performed', {
      ...context,
      healthy: healthStatus.healthy,
      warnings: healthStatus.warnings.length,
      critical: healthStatus.critical.length,
    })

    return new NextResponse(null, { status, headers })
  } catch (error) {
    logger.error('Health check failed', error as Error, context)
    return new NextResponse(null, {
      status: 503,
      headers: {
        'X-Health-Status': 'error',
        'X-Error': 'Health check failed',
      },
    })
  }
}

// Export metrics for external monitoring systems (Prometheus, DataDog, etc.)
export async function PATCH(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('Metrics export request received', context)

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      logger.warn('Unauthorized metrics export request', context)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = req.nextUrl
    const format = searchParams.get('format') || 'json'

    if (format === 'prometheus') {
      const monitoringData = performanceMonitor.exportForMonitoring()
      const prometheusMetrics = monitoringData.metrics
        .map(metric => {
          const labels = Object.entries(metric.labels)
            .map(([key, value]) => `${key}="${value}"`)
            .join(',')
          const labelStr = labels ? `{${labels}}` : ''
          return `# HELP ${metric.name} Performance metric\n# TYPE ${metric.name} gauge\n${metric.name}${labelStr} ${metric.value} ${metric.timestamp}`
        })
        .join('\n')

      return new NextResponse(prometheusMetrics, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        },
      })
    }

    // Default JSON format
    const monitoringData = performanceMonitor.exportForMonitoring()

    logger.info('Metrics exported successfully', {
      ...context,
      format,
      metricsCount: monitoringData.metrics.length,
    })

    return NextResponse.json(monitoringData, { status: 200 })
  } catch (error) {
    logger.error('Failed to export metrics', error as Error, context)
    return NextResponse.json(
      { error: 'Failed to export metrics' },
      { status: 500 },
    )
  }
}
