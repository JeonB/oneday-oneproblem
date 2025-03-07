import Image from 'next/image'
import { Algorithm } from '@/app/lib/models/Algorithms'
import CardList from '@/components/ui/problem/CardList'
import TodayProblemButton from '@/components/ui/problem/TodayProblemButton'
import { Suspense } from 'react'
import CardListSkeleton from '@/components/ui/problem/CardListSkeleton'

const MainPage = async () => {
  const url =
    process.env.NODE_ENV !== 'production'
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXTAUTH_URL
  const data = await fetch(url + 'api/algorithms')
  const algorithms: Algorithm[] = await data.json()
  return (
    <div>
      <div className="mx-auto flex flex-col items-center p-8">
        <div className="mb-10 flex flex-row justify-center gap-8">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={140}
            height={128}
            className="hidden h-32 w-auto rounded-lg md:block"
          />
          <div className="mt-4 flex flex-col items-center">
            <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              알고리즘 실력 향상을 위한 <br /> 맞춤형 학습 플랫폼
            </h1>
            <TodayProblemButton />
          </div>
        </div>
      </div>
      <Suspense fallback={<CardListSkeleton />}>
        <CardList algorithms={algorithms} />
      </Suspense>
    </div>
  )
}

export default MainPage
