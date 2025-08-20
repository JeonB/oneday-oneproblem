import { PerformanceDashboard } from '@/components/PerformanceDashboard'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authoptions'
import { redirect } from 'next/navigation'

export default async function PerformancePage() {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated
  if (!session?.user?.email) {
    redirect('/login')
  }

  // TODO: Add admin role check here
  // For now, allow any authenticated user to access performance data
  // In production, you should implement proper role-based access control

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
