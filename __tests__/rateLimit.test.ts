import { describe, it, expect, beforeEach, vi } from 'vitest'
import { rateLimit, getClientIdFromRequest } from '@/lib/rateLimit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear the buckets map between tests
    vi.clearAllMocks()
  })

  describe('rateLimit', () => {
    it('should allow requests within capacity', () => {
      const id = 'test-user'

      // First request should be allowed
      const result1 = rateLimit({ id, capacity: 5, refillPerSec: 1 })
      expect(result1.allowed).toBe(true)
      expect(result1.retryAfter).toBe(0)

      // Second request should also be allowed
      const result2 = rateLimit({ id, capacity: 5, refillPerSec: 1 })
      expect(result2.allowed).toBe(true)
      expect(result2.retryAfter).toBe(0)
    })

    it('should block requests when capacity is exceeded', () => {
      const id = 'test-user'

      // Exhaust the capacity
      for (let i = 0; i < 5; i++) {
        rateLimit({ id, capacity: 5, refillPerSec: 1 })
      }

      // Next request should be blocked
      const result = rateLimit({ id, capacity: 5, refillPerSec: 1 })
      expect(result.allowed).toBe(false)
      expect(result.retryAfter).toBeGreaterThan(0)
    })

    it('should refill tokens over time', () => {
      const id = 'test-user'

      // Exhaust the capacity
      for (let i = 0; i < 5; i++) {
        rateLimit({ id, capacity: 5, refillPerSec: 1 })
      }

      // Mock time passing (1 second)
      const originalDateNow = Date.now
      Date.now = vi.fn(() => originalDateNow() + 1000)

      // Should allow one more request after 1 second
      const result = rateLimit({ id, capacity: 5, refillPerSec: 1 })
      expect(result.allowed).toBe(true)
      expect(result.retryAfter).toBe(0)

      // Restore original Date.now
      Date.now = originalDateNow
    })

    it('should handle different refill rates', () => {
      const id = 'test-user'

      // Use a higher refill rate
      const result1 = rateLimit({ id, capacity: 10, refillPerSec: 5 })
      expect(result1.allowed).toBe(true)

      // Exhaust capacity
      for (let i = 0; i < 10; i++) {
        rateLimit({ id, capacity: 10, refillPerSec: 5 })
      }

      // Mock time passing (0.5 seconds)
      const originalDateNow = Date.now
      Date.now = vi.fn(() => originalDateNow() + 500)

      // Should allow some requests after 0.5 seconds with higher refill rate
      const result2 = rateLimit({ id, capacity: 10, refillPerSec: 5 })
      expect(result2.allowed).toBe(true)

      // Restore original Date.now
      Date.now = originalDateNow
    })

    it('should handle multiple different IDs independently', () => {
      const id1 = 'user-1'
      const id2 = 'user-2'

      // Exhaust capacity for user 1
      for (let i = 0; i < 5; i++) {
        rateLimit({ id: id1, capacity: 5, refillPerSec: 1 })
      }

      // User 2 should still be able to make requests
      const result = rateLimit({ id: id2, capacity: 5, refillPerSec: 1 })
      expect(result.allowed).toBe(true)
      expect(result.retryAfter).toBe(0)
    })
  })

  describe('getClientIdFromRequest', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const mockRequest = {
        headers: {
          get: vi.fn((name: string) => {
            if (name === 'x-forwarded-for') {
              return '192.168.1.1, 10.0.0.1'
            }
            return null
          }),
        },
      } as any

      const result = getClientIdFromRequest(mockRequest)
      expect(result).toBe('192.168.1.1')
    })

    it('should handle single IP in x-forwarded-for', () => {
      const mockRequest = {
        headers: {
          get: vi.fn((name: string) => {
            if (name === 'x-forwarded-for') {
              return '192.168.1.1'
            }
            return null
          }),
        },
      } as any

      const result = getClientIdFromRequest(mockRequest)
      expect(result).toBe('192.168.1.1')
    })

    it('should return anonymous when no IP is available', () => {
      const mockRequest = {
        headers: {
          get: vi.fn(() => null),
        },
      } as any

      const result = getClientIdFromRequest(mockRequest)
      expect(result).toBe('anonymous')
    })

    it('should handle empty x-forwarded-for header', () => {
      const mockRequest = {
        headers: {
          get: vi.fn((name: string) => {
            if (name === 'x-forwarded-for') {
              return ''
            }
            return null
          }),
        },
      } as any

      const result = getClientIdFromRequest(mockRequest)
      expect(result).toBe('anonymous')
    })
  })
})
