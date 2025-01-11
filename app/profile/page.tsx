import { ProfileForm } from '@/components/ui/profile/Profile'
import { connectDB } from '@/app/lib/connecter'
import User from '@/app/lib/models/User'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/authoptions'
import Problem from '@/app/lib/models/Problem'
import { DataTable } from '@/components/ui/profile/problems/data-table'
import { columns } from '@/components/ui/profile/problems/columns'

export default async function Page() {
  await connectDB()
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4">
        <p className="text-lg font-semibold text-gray-600">
          로그인이 필요합니다.
        </p>
      </div>
    )
  }

  try {
    const email = session.user?.email
    const user = await User.findOne({ email })
    const userId = user?._id
    const problems = await Problem.find({ userId }).lean()
    const transformedProblems = problems.map(problem => ({
      userSolution: problem.userSolution,
      content: problem.content,
      title: problem.title,
      topic: problem.topic,
      difficulty: problem.difficulty,
      createdAt: problem.createdAt,
    }))
    const defaultValues = {
      streak: user?.streak || 0,
      totalProblemsSolved: user?.totalProblemsSolved || 0,
      username: user?.name || '',
      password: '',
    }
    return (
      <div className="flex min-h-screen flex-col items-center px-6 py-10 text-gray-100">
        <main className="w-full max-w-5xl space-y-12">
          <h1 className="mb-4 w-fit border-b-2 border-gray-500 pb-2 text-4xl font-bold text-gray-100">
            프로필 관리
          </h1>
          <section className="rounded-lg bg-gray-800 p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-gray-200">
              사용자 정보
            </h2>
            <ProfileForm defaultValues={defaultValues} />
          </section>

          <section className="rounded-lg bg-gray-800 p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-200">
              풀이 기록
            </h2>
            <div className="overflow-hidden">
              <DataTable
                className="min-w-full table-auto text-left text-sm text-gray-300"
                columns={columns}
                data={transformedProblems}
              />
            </div>
          </section>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error fetching user data:', error)
    return (
      <div className="flex h-screen w-full items-center justify-center px-4">
        <p className="text-lg font-semibold text-red-600">
          사용자 데이터를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    )
  }
}
