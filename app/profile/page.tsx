import { ProfileForm } from '@/components/ui/profile/Profile'
import { connectDB } from '@/app/lib/connecter'
import User from '@/app/lib/models/User'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/authoptions'

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

  const email = session.user?.email
  const user = await User.findOne({ email })
  const defaultValues = {
    streak: user?.streak || 0,
    totalProblemsSolved: user?.totalProblemsSolved || 0,
    username: user?.name || '',
    password: '',
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <ProfileForm defaultValues={defaultValues} />
    </div>
  )
}
