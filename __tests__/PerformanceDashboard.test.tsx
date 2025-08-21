import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { PerformanceDashboard } from '@/components/PerformanceDashboard'

// Mock fetch
global.fetch = vi.fn()

// Mock ErrorBoundary
vi.mock('@/components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('PerformanceDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading state initially', () => {
    render(<PerformanceDashboard />)
    
    expect(screen.getByText('Loading performance data...')).toBeInTheDocument()
  })

  it('should render performance data when loaded', async () => {
    const mockData = {
      stats: [
        {
          operation: 'test-operation',
          count: 100,
          avgDuration: 150,
          minDuration: 50,
          maxDuration: 300,
          p95Duration: 250,
          p99Duration: 280,
          errorRate: 0.02,
          lastUpdated: Date.now(),
        },
      ],
      timestamp: Date.now(),
      total: 1,
    }

    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    render(<PerformanceDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Healthy')).toBeInTheDocument()
    })

    expect(screen.getByText('100')).toBeInTheDocument() // Total operations
  })

  it('should handle fetch errors gracefully', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('Network error'))

    render(<PerformanceDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('should handle HTTP errors', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    render(<PerformanceDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('HTTP error! status: 500')).toBeInTheDocument()
    })
  })

  it('should display status indicators', async () => {
    const mockData = {
      stats: [
        {
          operation: 'test-operation',
          count: 100,
          avgDuration: 50,
          minDuration: 10,
          maxDuration: 100,
          p95Duration: 80,
          p99Duration: 90,
          errorRate: 0.01,
          lastUpdated: Date.now(),
        },
      ],
      timestamp: Date.now(),
      total: 1,
    }

    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    render(<PerformanceDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Healthy')).toBeInTheDocument()
    })
  })
})
