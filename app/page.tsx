import Image from 'next/image'
import { Algorithm } from '@/app/lib/models/Algorithms'
import CardList from '@/components/ui/problem/CardList'
import TodayProblemButton from '@/components/ui/problem/TodayProblemButton'
import { Suspense } from 'react'
import CardListSkeleton from '@/components/ui/problem/CardListSkeleton'

const MainPage = async () => {
  const url =
    process.env.NODE_ENV !== 'production'
      ? process.env.DEV_URL
      : process.env.PRODUCTION_URL
  const data = await fetch(url + 'api/algorithms', {
    next: { revalidate: 0 },
  })
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
      <div className="mb-10 flex justify-center">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <Suspense fallback={<CardListSkeleton />}>
            <CardList algorithms={algorithms} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default MainPage
