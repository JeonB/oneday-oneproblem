import { logger } from './logger'

export interface PerformanceMetric {
  operation: string
  duration: number
  timestamp: number
  userId?: string
  clientId?: string
  success: boolean
  error?: string
  metadata?: Record<string, any>
}

export interface PerformanceStats {
  operation: string
  count: number
  avgDuration: number
  minDuration: number
  maxDuration: number
  p95Duration: number
  p99Duration: number
  errorRate: number
  lastUpdated: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private readonly maxMetrics = 10000 // Keep last 10k metrics
  private readonly flushInterval = 60000 // Flush every minute
  private flushTimer?: NodeJS.Timeout

  constructor() {
    this.startPeriodicFlush()
  }

  record(metric: Omit<PerformanceMetric, 'timestamp'>) {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
    }

    this.metrics.push(fullMetric)

    // Keep only the last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log high-duration operations immediately
    if (metric.duration > 1000) {
      logger.warn('Slow operation detected', {
        operation: metric.operation,
        duration: metric.duration,
        userId: metric.userId,
        clientId: metric.clientId,
      })
    }

    // Log errors immediately
    if (!metric.success) {
      logger.error('Operation failed', {
        operation: metric.operation,
        duration: metric.duration,
        error: metric.error,
        userId: metric.userId,
        clientId: metric.clientId,
      })
    }
  }

  getStats(operation?: string): PerformanceStats[] {
    const relevantMetrics = operation
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics

    if (relevantMetrics.length === 0) {
      return []
    }

    const durations = relevantMetrics.map(m => m.duration).sort((a, b) => a - b)
    const errors = relevantMetrics.filter(m => !m.success).length

    const stats: PerformanceStats = {
      operation: operation || 'all',
      count: relevantMetrics.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: durations[0],
      maxDuration: durations[durations.length - 1],
      p95Duration: this.getPercentile(durations, 95),
      p99Duration: this.getPercentile(durations, 99),
      errorRate: errors / relevantMetrics.length,
      lastUpdated: Date.now(),
    }

    return [stats]
  }

  private getPercentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1
    return sortedArray[Math.max(0, index)]
  }

  private startPeriodicFlush() {
    this.flushTimer = setInterval(() => {
      this.flushMetrics()
    }, this.flushInterval)
  }

  private flushMetrics() {
    if (this.metrics.length === 0) return

    const stats = this.getStats()
    logger.info('Performance metrics summary', {
      totalOperations: this.metrics.length,
      stats: stats.map(s => ({
        operation: s.operation,
        avgDuration: Math.round(s.avgDuration),
        p95Duration: Math.round(s.p95Duration),
        errorRate: Math.round(s.errorRate * 100) / 100,
      })),
    })

    // Clear old metrics (keep last 1000)
    this.metrics = this.metrics.slice(-1000)
  }

  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Convenience function to record performance metrics
export function recordPerformance(
  operation: string,
  duration: number,
  success: boolean,
  options?: {
    userId?: string
    clientId?: string
    error?: string
    metadata?: Record<string, any>
  },
) {
  performanceMonitor.record({
    operation,
    duration,
    success,
    userId: options?.userId,
    clientId: options?.clientId,
    error: options?.error,
    metadata: options?.metadata,
  })
}

// Enhanced performance monitoring wrapper
export function withEnhancedPerformanceMonitoring<T>(
  operationName: string,
  operation: () => Promise<T>,
  options?: {
    userId?: string
    clientId?: string
    metadata?: Record<string, any>
  },
): Promise<T> {
  const start = Date.now()

  return operation()
    .then(result => {
      const duration = Date.now() - start
      recordPerformance(operationName, duration, true, {
        userId: options?.userId,
        clientId: options?.clientId,
        metadata: options?.metadata,
      })
      return result
    })
    .catch(error => {
      const duration = Date.now() - start
      recordPerformance(operationName, duration, false, {
        userId: options?.userId,
        clientId: options?.clientId,
        error: error.message,
        metadata: options?.metadata,
      })
      throw error
    })
}
