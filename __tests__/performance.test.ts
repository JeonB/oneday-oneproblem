import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  performanceMonitor,
  recordPerformance,
  withEnhancedPerformanceMonitoring,
} from '@/lib/performance'

// Mock the logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

describe('Performance Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the performance monitor
    performanceMonitor['metrics'] = []
  })

  describe('recordPerformance', () => {
    it('should record performance metrics correctly', () => {
      const metric = {
        operation: 'test-operation',
        duration: 150,
        success: true,
        userId: 'user123',
        clientId: 'client456',
      }

      recordPerformance(metric.operation, metric.duration, metric.success, {
        userId: metric.userId,
        clientId: metric.clientId,
      })

      const stats = performanceMonitor.getStats('test-operation')
      expect(stats).toHaveLength(1)
      expect(stats[0].operation).toBe('test-operation')
      expect(stats[0].count).toBe(1)
      expect(stats[0].avgDuration).toBe(150)
      expect(stats[0].errorRate).toBe(0)
    })

    it('should record failed operations correctly', () => {
      recordPerformance('failed-operation', 200, false, {
        error: 'Test error',
      })

      const stats = performanceMonitor.getStats('failed-operation')
      expect(stats).toHaveLength(1)
      expect(stats[0].errorRate).toBe(1)
    })

    it('should log slow operations', async () => {
      const logger = vi.mocked(await import('@/lib/logger')).logger

      recordPerformance('slow-operation', 1500, true)

      expect(logger.warn).toHaveBeenCalledWith('Slow operation detected', {
        operation: 'slow-operation',
        duration: 1500,
        userId: undefined,
        clientId: undefined,
      })
    })

    it('should log failed operations', async () => {
      const logger = vi.mocked(await import('@/lib/logger')).logger

      recordPerformance('failed-operation', 100, false, {
        error: 'Test error',
      })

      expect(logger.error).toHaveBeenCalledWith('Operation failed', {
        operation: 'failed-operation',
        duration: 100,
        error: 'Test error',
        userId: undefined,
        clientId: undefined,
      })
    })
  })

  describe('performanceMonitor.getStats', () => {
    it('should calculate statistics correctly', () => {
      // Record multiple metrics
      recordPerformance('test-op', 100, true)
      recordPerformance('test-op', 200, true)
      recordPerformance('test-op', 300, false)
      recordPerformance('test-op', 400, true)

      const stats = performanceMonitor.getStats('test-op')
      expect(stats).toHaveLength(1)

      const stat = stats[0]
      expect(stat.operation).toBe('test-op')
      expect(stat.count).toBe(4)
      expect(stat.avgDuration).toBe(250) // (100 + 200 + 300 + 400) / 4
      expect(stat.minDuration).toBe(100)
      expect(stat.maxDuration).toBe(400)
      expect(stat.errorRate).toBe(0.25) // 1 out of 4 failed
    })

    it('should return empty array for non-existent operation', () => {
      const stats = performanceMonitor.getStats('non-existent')
      expect(stats).toHaveLength(0)
    })

    it('should return all stats when no operation specified', () => {
      recordPerformance('op1', 100, true)
      recordPerformance('op2', 200, true)

      const stats = performanceMonitor.getStats()
      expect(stats).toHaveLength(1)
      expect(stats[0].operation).toBe('all')
      expect(stats[0].count).toBe(2)
    })
  })

  describe('withEnhancedPerformanceMonitoring', () => {
    it('should monitor successful operations', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success')
      const logger = vi.mocked(await import('@/lib/logger')).logger

      const result = await withEnhancedPerformanceMonitoring(
        'test-operation',
        mockOperation,
        { userId: 'user123' },
      )

      expect(result).toBe('success')
      expect(mockOperation).toHaveBeenCalled()

      const stats = performanceMonitor.getStats('test-operation')
      expect(stats).toHaveLength(1)
      expect(stats[0].count).toBe(1)
      expect(stats[0].errorRate).toBe(0)
    })

    it('should monitor failed operations', async () => {
      const mockError = new Error('Test error')
      const mockOperation = vi.fn().mockRejectedValue(mockError)
      const logger = vi.mocked(await import('@/lib/logger')).logger

      await expect(
        withEnhancedPerformanceMonitoring('test-operation', mockOperation),
      ).rejects.toThrow('Test error')

      const stats = performanceMonitor.getStats('test-operation')
      expect(stats).toHaveLength(1)
      expect(stats[0].count).toBe(1)
      expect(stats[0].errorRate).toBe(1)
    })

    it('should include metadata in performance tracking', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success')

      await withEnhancedPerformanceMonitoring('test-operation', mockOperation, {
        userId: 'user123',
        clientId: 'client456',
        metadata: { customField: 'value' },
      })

      const stats = performanceMonitor.getStats('test-operation')
      expect(stats).toHaveLength(1)
      expect(stats[0].count).toBe(1)
    })
  })

  describe('Performance metrics management', () => {
    it('should limit the number of stored metrics', () => {
      // Add more than maxMetrics
      for (let i = 0; i < 10001; i++) {
        recordPerformance(`operation-${i}`, 100, true)
      }

      // Should only keep the last 10000 metrics
      const allStats = performanceMonitor.getStats()
      expect(allStats[0].count).toBeLessThanOrEqual(10000)
    })

    it('should calculate percentiles correctly', () => {
      // Add 100 metrics with durations 1-100
      for (let i = 1; i <= 100; i++) {
        recordPerformance('percentile-test', i, true)
      }

      const stats = performanceMonitor.getStats('percentile-test')
      expect(stats[0].p95Duration).toBe(95) // 95th percentile
      expect(stats[0].p99Duration).toBe(99) // 99th percentile
    })

    it('should reset metrics correctly', () => {
      // Add some metrics
      recordPerformance('test-op', 100, true)
      recordPerformance('test-op', 200, true)

      // Verify metrics exist
      let stats = performanceMonitor.getStats('test-op')
      expect(stats).toHaveLength(1)
      expect(stats[0].count).toBe(2)

      // Reset metrics
      performanceMonitor.reset()

      // Verify metrics are cleared
      stats = performanceMonitor.getStats('test-op')
      expect(stats).toHaveLength(0)
    })
  })
})
