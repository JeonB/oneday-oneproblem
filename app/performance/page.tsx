import { PerformanceDashboard } from '@/components/PerformanceDashboard'
import { getCurrentUser, canAccessPerformance } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function PerformancePage() {
  const user = await getCurrentUser()

  // Check if user is authenticated
  if (!user) {
    redirect('/login')
  }

  // Check if user has permission to access performance data
  if (!canAccessPerformance(user)) {
    redirect('/unauthorized')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            System Performance
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor real-time performance metrics and system health
          </p>
        </div>

        <PerformanceDashboard />
      </div>
    </div>
  )
}
