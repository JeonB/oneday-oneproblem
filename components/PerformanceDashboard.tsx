'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

interface PerformanceStats {
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

interface PerformanceData {
  stats: PerformanceStats[]
  timestamp: number
  total: number
}

export function PerformanceDashboard() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOperation, setSelectedOperation] = useState<string>('')
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds
  const [healthStatus, setHealthStatus] = useState<{
    healthy: boolean
    warnings: string[]
    critical: string[]
  } | null>(null)

  const fetchPerformanceData = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedOperation) {
        params.append('operation', selectedOperation)
      }
      params.append('limit', '20')

      const response = await fetch(`/api/performance?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const performanceData: PerformanceData = await response.json()
      setData(performanceData)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch performance data',
      )
    } finally {
      setLoading(false)
    }
  }, [selectedOperation])

  const fetchHealthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/performance', { method: 'HEAD' })
      const healthStatus = {
        healthy: response.headers.get('X-Health-Status') === 'healthy',
        warnings: response.headers.get('X-Warnings')?.split(', ') || [],
        critical: response.headers.get('X-Critical')?.split(', ') || [],
      }
      setHealthStatus(healthStatus)
    } catch (err) {
      console.error('Failed to fetch health status:', err)
    }
  }, [])

  useEffect(() => {
    fetchPerformanceData()
    fetchHealthStatus()

    const interval = setInterval(fetchPerformanceData, refreshInterval)
    const healthInterval = setInterval(fetchHealthStatus, 60000) // Check health every minute
    return () => {
      clearInterval(interval)
      clearInterval(healthInterval)
    }
  }, [
    selectedOperation,
    refreshInterval,
    fetchPerformanceData,
    fetchHealthStatus,
  ])

  const formatDuration = (ms: number) => {
    if (ms < 1) return '<1ms'
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatErrorRate = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`
  }

  const getStatusColor = (operation: PerformanceStats) => {
    if (operation.errorRate > 0.05) return 'text-red-600'
    if (operation.avgDuration > 1000) return 'text-yellow-600'
    return 'text-green-600'
  }

  const resetMetrics = async () => {
    try {
      const response = await fetch('/api/performance', { method: 'DELETE' })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      await fetchPerformanceData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset metrics')
    }
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading performance data...</span>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Performance Dashboard
            </h2>
            <p className="text-gray-600">
              Real-time performance metrics and system health monitoring
            </p>
            {healthStatus && (
              <div className="mt-2 flex items-center space-x-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    healthStatus.healthy
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                  {healthStatus.healthy
                    ? 'System Healthy'
                    : 'System Issues Detected'}
                </span>
                {healthStatus.warnings.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    {healthStatus.warnings.length} Warning
                    {healthStatus.warnings.length > 1 ? 's' : ''}
                  </span>
                )}
                {healthStatus.critical.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    {healthStatus.critical.length} Critical Issue
                    {healthStatus.critical.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedOperation}
              onChange={e => setSelectedOperation(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
              <option value="">All Operations</option>
              {data?.stats.map(stat => (
                <option key={stat.operation} value={stat.operation}>
                  {stat.operation}
                </option>
              ))}
            </select>
            <select
              value={refreshInterval}
              onChange={e => setRefreshInterval(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
              <option value={10000}>10s refresh</option>
              <option value={30000}>30s refresh</option>
              <option value={60000}>1m refresh</option>
              <option value={300000}>5m refresh</option>
            </select>
            <button
              onClick={resetMetrics}
              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              Reset Metrics
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {data && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Operations
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Avg Response Time
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatDuration(
                      data.stats.reduce(
                        (sum, stat) => sum + stat.avgDuration,
                        0,
                      ) / data.stats.length,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    P95 Response Time
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatDuration(
                      Math.max(...data.stats.map(stat => stat.p95Duration)),
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Error Rate
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatErrorRate(
                      data.stats.reduce(
                        (sum, stat) => sum + stat.errorRate,
                        0,
                      ) / data.stats.length,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Stats Table */}
        {data && data.stats.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Operation Details
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Operation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Avg Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      P95 Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Error Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.stats.map(stat => (
                    <tr key={stat.operation} className={getStatusColor(stat)}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {stat.operation}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {stat.count.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {formatDuration(stat.avgDuration)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {formatDuration(stat.p95Duration)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {formatErrorRate(stat.errorRate)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            stat.errorRate > 0.05
                              ? 'bg-red-100 text-red-800'
                              : stat.avgDuration > 1000
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                          {stat.errorRate > 0.05
                            ? 'Critical'
                            : stat.avgDuration > 1000
                              ? 'Warning'
                              : 'Healthy'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Last Updated */}
        {data && (
          <div className="text-center text-sm text-gray-500">
            Last updated: {new Date(data.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
