'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Card from '@/components/ui/problem/AlgorithmCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Algorithm } from '@/app/lib/models/Algorithms'
import DifficultyModal from '@/components/ui/problem/DifficultyModal'
import { useAlgorithmStore, useProblemStore } from '@/components/context/Store'

const MainPage: React.FC = () => {
  const router = useRouter()
  const { algorithms, isLoading, fetchAlgorithms } = useAlgorithmStore()
  const { setTopic } = useProblemStore()
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(
    null,
  )
  const [isModalOpen, setModalOpen] = useState(false)

  // 난이도 랜덤 선택 함수
  const getRandomDifficulty = () =>
    ['easy', 'normal', 'hard'][Math.floor(Math.random() * 3)]

  useEffect(() => {
    if (algorithms.length === 0) {
      fetchAlgorithms()
    }
  }, [algorithms, fetchAlgorithms])

  // 난이도 선택 후 이동
  const handleSelectDifficulty = (difficulty: string) => {
    setModalOpen(false)
    setTopic(selectedAlgorithm?.name || '')
    router.push(`/problem/${selectedAlgorithm?.topic}?difficulty=${difficulty}`)
  }

  return (
    <div>
      {/* 상단 로고 및 버튼 */}
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
            <Button
              className="rounded-full bg-[#43B9AA] px-6 py-2 text-white"
              onClick={() =>
                router.push(
                  `/problem/random?difficulty=${getRandomDifficulty()}`,
                )
              }>
              오늘의 문제 풀이
            </Button>
          </div>
        </div>
      </div>

      {/* 알고리즘 카드 리스트 섹션 */}
      <div className="mb-10 flex justify-center">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 20 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-32 w-32 rounded-lg md:h-40 md:w-40"
                />
              ))
            : algorithms.map(algorithm => (
                <Card
                  key={algorithm.topic}
                  onClick={() => {
                    setSelectedAlgorithm(algorithm)
                    setModalOpen(true)
                  }}
                  topic={algorithm.topic}
                  algorithm={algorithm.name}
                  img={algorithm.img}
                />
              ))}
        </div>
      </div>

      {/* 난이도 선택 모달 */}
      <DifficultyModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelectDifficulty={handleSelectDifficulty}
      />
    </div>
  )
}

export default MainPage
