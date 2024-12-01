'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import Image from 'next/image'
import Card from '@/components/ui/Card'

const algorithms = [
  {
    name: '동적 계획법',
    topic: 'dynamic programming',
    img: '/images/dynamic.png',
  },
  { name: '그래프', topic: 'graph', img: '/images/graph.png' },
  { name: '탐욕법', topic: 'greedy', img: '/images/greedy.png' },
  { name: '백트래킹', topic: 'backtracking', img: '/images/back.png' },
  { name: '문자열', topic: 'string', img: '/images/string.png' },
  { name: '트리', topic: 'tree', img: '/images/tree.png' },
  { name: '해싱', topic: 'hashing', img: '/images/hashing.png' },
  { name: '스택', topic: 'stack', img: '/images/stack.png' },
  { name: '큐', topic: 'queue', img: '/images/queue.png' },
  { name: '힙', topic: 'heap', img: '/images/heap.png' },
  { name: '연결 리스트', topic: 'linked list', img: '/images/list.png' },
  {
    name: '이진 탐색',
    topic: 'binary search',
    img: '/images/search.png',
  },
  {
    name: '최단 경로',
    topic: 'shortest path',
    img: '/images/path.png',
  },
  {
    name: '최소 신장 트리',
    topic: 'minimum spanning tree',
    img: '/images/spanning.png',
  },
  {
    name: '위상 정렬',
    topic: 'topological sort',
    img: '/images/topology.png',
  },
  {
    name: '문자열 매칭',
    topic: 'string matching',
    img: '/images/matching.png',
  },
]

const insertAlgorithms = async () => {
  const response = await fetch('/api/insertAlgo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ algorithms }),
  })
  if (response.ok) {
    console.log('Algorithms inserted successfully')
  } else {
    console.error('Failed to insert algorithms:', response.statusText)
  }
}
const MainPage: React.FC = () => {
  const router = useRouter()

  const handleAlgorithmClick = (topic: string) => {
    // 사용자가 선택한 알고리즘으로 문제 페이지로 이동
    router.push(`/problem/${topic}`)
  }

  return (
    <div className="mx-auto flex flex-col items-center p-8">
      <button
        onClick={insertAlgorithms}
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white">
        알고리즘 추가
      </button>
      <div className="mb-10 flex flex-row justify-center gap-8">
        <Image src="/images/logo.png" alt="logo" width={150} height={100} />
        <div className="mt-4 flex flex-col items-center">
          <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            알고리즘 실력 향상을 위한 <br /> 맞춤형 학습 플랫폼
          </h1>
          <button className="rounded-full bg-[#43B9AA] px-6 py-2 text-white">
            오늘의 문제 풀이
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 px-20">
        {algorithms.map(algorithm => (
          <Card
            key={algorithm.topic}
            onClick={() => handleAlgorithmClick(algorithm.topic)}
            topic={algorithm.topic}
            algorithm={algorithm.name}
            img={algorithm.img}
          />
          /* <button
            key={algorithm.topic}
            onClick={() => handleAlgorithmClick(algorithm.topic)}
            className="rounded-lg border border-gray-300 p-4 flex flex-col items-center">
            <Image src={algorithm.img} alt={algorithm.name} width={50} height={50} />
            {algorithm.name}
            </button> */
        ))}
      </div>
    </div>
  )
}

export default MainPage
