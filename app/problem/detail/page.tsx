'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useProblemStore } from '@/components/context/StoreContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

function ProblemDetailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const topic = searchParams.get('topic')
  const difficulty = searchParams.get('difficulty')

  const content = useProblemStore(state => state.content)
  const userSolution = useProblemStore(state => state.userSolution)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (content && userSolution) {
      setIsLoading(false)
    }
  }, [content, userSolution])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        <h1 className="text-2xl font-bold">
          {topic} - {difficulty}
        </h1>
      </div>

      <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">문제 내용</h2>
        <div className="whitespace-pre-wrap text-gray-300">{content}</div>
      </div>

      <div className="rounded-lg bg-gray-800 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">내 풀이</h2>
        <div className="whitespace-pre-wrap text-gray-300">{userSolution}</div>
      </div>
    </div>
  )
}

export default function ProblemDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <p className="text-lg font-semibold text-gray-600">로딩 중...</p>
        </div>
      }>
      <ProblemDetailContent />
    </Suspense>
  )
}
