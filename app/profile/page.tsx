import { ProfileForm } from '@/components/ui/profile/Profile'
import { connectDB } from '@/app/lib/connecter'
import User from '@/app/lib/models/User'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/authoptions'
import Problem from '../lib/models/Problem'

export default async function Page() {
  await connectDB()
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center px-4">
        <p>로그인이 필요합니다.</p>
      </div>
    )
  }

  try {
    const email = session.user?.email
    const user = await User.findOne({ email })
    const userId = user?._id
    const problems = await Problem.find({ userId })
    const defaultValues = {
      streak: user?.streak || 0,
      totalProblemsSolved: user?.totalProblemsSolved || 0,
      username: user?.name || '',
      password: '',
    }
    console.log('problems:', problems)
    return (
      <div className="flex h-screen w-full items-center justify-center px-4">
        <ProfileForm defaultValues={defaultValues} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching user data:', error)
    return (
      <div className="flex h-screen w-full items-center justify-center px-4">
        <p>사용자 데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }
}
