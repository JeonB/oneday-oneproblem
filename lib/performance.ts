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
      const error = metric.error
        ? new Error(metric.error)
        : new Error('Unknown error')
      logger.error('Operation failed', error, {
        operation: metric.operation,
        duration: metric.duration,
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

  // Reset all metrics
  reset() {
    this.metrics = []
    logger.info('Performance metrics reset successfully')
  }

  // Export metrics for external monitoring systems
  exportMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  // Get metrics summary for health checks
  getHealthStatus(): {
    healthy: boolean
    warnings: string[]
    critical: string[]
    summary: {
      totalOperations: number
      avgResponseTime: number
      errorRate: number
      slowOperations: number
    }
  } {
    const allStats = this.getStats()
    const warnings: string[] = []
    const critical: string[] = []

    // Check overall error rate
    const totalErrors = this.metrics.filter(m => !m.success).length
    const totalOperations = this.metrics.length
    const errorRate = totalOperations > 0 ? totalErrors / totalOperations : 0

    if (errorRate > 0.05) {
      critical.push(`High error rate: ${(errorRate * 100).toFixed(2)}%`)
    } else if (errorRate > 0.02) {
      warnings.push(`Elevated error rate: ${(errorRate * 100).toFixed(2)}%`)
    }

    // Check for slow operations
    const slowOperations = this.metrics.filter(m => m.duration > 1000).length
    if (slowOperations > totalOperations * 0.1) {
      warnings.push(`High number of slow operations: ${slowOperations}`)
    }

    // Check average response time
    const avgResponseTime =
      allStats.length > 0
        ? allStats.reduce((sum, stat) => sum + stat.avgDuration, 0) /
          allStats.length
        : 0

    if (avgResponseTime > 2000) {
      critical.push(
        `Very high average response time: ${avgResponseTime.toFixed(0)}ms`,
      )
    } else if (avgResponseTime > 1000) {
      warnings.push(
        `High average response time: ${avgResponseTime.toFixed(0)}ms`,
      )
    }

    return {
      healthy: critical.length === 0 && warnings.length === 0,
      warnings,
      critical,
      summary: {
        totalOperations,
        avgResponseTime,
        errorRate,
        slowOperations,
      },
    }
  }

  // Export metrics for external monitoring systems (e.g., Prometheus, DataDog)
  exportForMonitoring(): {
    metrics: Array<{
      name: string
      value: number
      labels: Record<string, string>
      timestamp: number
    }>
    summary: {
      totalOperations: number
      avgResponseTime: number
      errorRate: number
      slowOperations: number
    }
  } {
    const allStats = this.getStats()
    const metrics: Array<{
      name: string
      value: number
      labels: Record<string, string>
      timestamp: number
    }> = []

    // Add operation-specific metrics
    allStats.forEach(stat => {
      metrics.push({
        name: 'operation_duration_avg',
        value: stat.avgDuration,
        labels: { operation: stat.operation },
        timestamp: Date.now(),
      })
      metrics.push({
        name: 'operation_duration_p95',
        value: stat.p95Duration,
        labels: { operation: stat.operation },
        timestamp: Date.now(),
      })
      metrics.push({
        name: 'operation_duration_p99',
        value: stat.p99Duration,
        labels: { operation: stat.operation },
        timestamp: Date.now(),
      })
      metrics.push({
        name: 'operation_count',
        value: stat.count,
        labels: { operation: stat.operation },
        timestamp: Date.now(),
      })
      metrics.push({
        name: 'operation_error_rate',
        value: stat.errorRate,
        labels: { operation: stat.operation },
        timestamp: Date.now(),
      })
    })

    // Add global metrics
    const totalOperations = this.metrics.length
    const totalErrors = this.metrics.filter(m => !m.success).length
    const errorRate = totalOperations > 0 ? totalErrors / totalOperations : 0
    const avgResponseTime =
      allStats.length > 0
        ? allStats.reduce((sum, stat) => sum + stat.avgDuration, 0) /
          allStats.length
        : 0
    const slowOperations = this.metrics.filter(m => m.duration > 1000).length

    metrics.push({
      name: 'total_operations',
      value: totalOperations,
      labels: {},
      timestamp: Date.now(),
    })
    metrics.push({
      name: 'total_errors',
      value: totalErrors,
      labels: {},
      timestamp: Date.now(),
    })
    metrics.push({
      name: 'error_rate',
      value: errorRate,
      labels: {},
      timestamp: Date.now(),
    })
    metrics.push({
      name: 'avg_response_time',
      value: avgResponseTime,
      labels: {},
      timestamp: Date.now(),
    })
    metrics.push({
      name: 'slow_operations',
      value: slowOperations,
      labels: {},
      timestamp: Date.now(),
    })

    return {
      metrics,
      summary: {
        totalOperations,
        avgResponseTime,
        errorRate,
        slowOperations,
      },
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
