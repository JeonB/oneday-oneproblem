'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Card from '@/components/ui/problem/AlgorithmCard'
import { Button } from '@/components/ui/button'
import { Algorithm } from '@/app/lib/models/Algorithms'
import DifficultyModal from '@/components/ui/problem/DifficultyModal'
import { useAlgorithmStore } from '@/components/context/Store'
const MainPage: React.FC = () => {
  const router = useRouter()
  const { algorithms, setAlgorithms } = useAlgorithmStore()
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(
    null,
  )
  const [isModalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const response = await fetch('/api/algorithms')
        if (!response.ok) {
          throw new Error(`Failed to fetch algorithms: ${response.statusText}`)
        }
        const data: Algorithm[] = await response.json()
        setAlgorithms(data)
      } catch (error) {
        console.error(error)
        alert(
          '알고리즘 데이터를 가져오지 못했습니다. 나중에 다시 시도해주세요.',
        )
      }
    }

    if (algorithms.length === 0) {
      fetchAlgorithms()
    }
  }, [algorithms, setAlgorithms])

  const handleSelectDifficulty = (difficulty: string) => {
    setModalOpen(false) // 모달 닫기
    router.push(`/problem/${selectedAlgorithm?.topic}?difficulty=${difficulty}`) // 이동
  }

  const handleAlgorithmClick = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm)
    setModalOpen(true) // 모달 열기
  }

  // const deleteData = async () => {
  //   try {
  //     const response = await fetch('/api/algorithms', {
  //       method: 'DELETE',
  //     })
  //     if (!response.ok) {
  //       throw new Error(`Failed to delete data: ${response.statusText}`)
  //     }
  //     setAlgorithms([])
  //   } catch (error) {
  //     console.error(error)
  //     alert('데이터 삭제에 실패했습니다. 나중에 다시 시도해주세요.')
  //   }
  // }
  // const testalgorithms = [
  //   {
  //     name: '동적 계획법',
  //     topic: 'dynamic programming',
  //     img: '/images/dynamic.png',
  //   },
  //   { name: '그래프', topic: 'graph', img: '/images/graph.png' },
  //   { name: '탐욕법', topic: 'greedy', img: '/images/greedy.png' },
  //   { name: '백트래킹', topic: 'backtracking', img: '/images/back.png' },
  //   { name: '문자열', topic: 'string', img: '/images/string.png' },
  //   { name: '트리', topic: 'tree', img: '/images/tree.png' },
  //   { name: '해싱', topic: 'hashing', img: '/images/hashing.png' },
  //   { name: '스택', topic: 'stack', img: '/images/stack.png' },
  //   { name: '큐', topic: 'queue', img: '/images/queue.png' },
  //   { name: '힙', topic: 'heap', img: '/images/heap.png' },
  //   { name: '연결 리스트', topic: 'linked list', img: '/images/list.png' },
  //   {
  //     name: '이진 탐색',
  //     topic: 'binary search',
  //     img: '/images/search.png',
  //   },
  //   {
  //     name: '최단 경로',
  //     topic: 'shortest path',
  //     img: '/images/path.png',
  //   },
  //   {
  //     name: '최소 신장 트리',
  //     topic: 'minimum spanning tree',
  //     img: '/images/spanning.png',
  //   },
  //   {
  //     name: '위상 정렬',
  //     topic: 'topological sort',
  //     img: '/images/topology.png',
  //   },
  //   {
  //     name: '문자열 매칭',
  //     topic: 'string matching',
  //     img: '/images/matching.png',
  //   },
  // ]

  // const insertAlgorithms = async () => {
  //   const response = await fetch('/api/algorithms', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ testalgorithms }),
  //   })
  //   if (response.ok) {
  //     console.log('Algorithms inserted successfully')
  //   } else {
  //     console.error('Failed to insert algorithms:', response.statusText)
  //   }
  // }
  return (
    <div>
      <div className="mx-auto flex flex-col items-center p-8">
        <div className="mb-10 flex flex-row justify-center gap-8">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={150}
            height={100}
            priority
            className="hidden rounded-lg md:block"
          />
          <div className="mt-4 flex flex-col items-center">
            <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              알고리즘 실력 향상을 위한 <br /> 맞춤형 학습 플랫폼
            </h1>
            <Button className="rounded-full bg-[#43B9AA] px-6 py-2 text-white">
              오늘의 문제 풀이
            </Button>
            {/* <Button onClick={insertAlgorithms}>다 삽입</Button> */}
            {/* <Button onClick={deleteData}>다 삭제</Button> */}
          </div>
        </div>
      </div>

      {/* 알고리즘 카드 리스트 섹션 */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {algorithms.map(algorithm => (
            <Card
              key={algorithm.topic}
              onClick={() => handleAlgorithmClick(algorithm)}
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
