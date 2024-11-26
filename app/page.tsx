'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import Image from 'next/image'

const algorithms = [
  { name: '정렬', topic: 'sorting' },
  { name: '탐색', topic: 'searching' },
  { name: '자료 구조', topic: 'data structures' },
  { name: '동적 계획법', topic: 'dynamic programming' },
  { name: '그래프', topic: 'graph' },
  { name: '탐욕법', topic: 'greedy' },
  { name: '백트래킹', topic: 'backtracking' },
  { name: '비트 조작', topic: 'bit manipulation' },
  { name: '수학', topic: 'math' },
  { name: '문자열', topic: 'string' },
  { name: '기하학', topic: 'geometry' },
  { name: '트리', topic: 'tree' },
  { name: '해싱', topic: 'hashing' },
  { name: '스택', topic: 'stack' },
  { name: '큐', topic: 'queue' },
  { name: '힙', topic: 'heap' },
  { name: '연결 리스트', topic: 'linked list' },
  { name: '트라이', topic: 'trie' },
  { name: '세그먼트 트리', topic: 'segment tree' },
  { name: '이진 탐색 트리', topic: 'binary search tree' },
  { name: '분리 집합', topic: 'disjoint set' },
  { name: '펜윅 트리', topic: 'fenwick tree' },
  { name: '접미사 배열', topic: 'suffix array' },
  { name: '위상 정렬', topic: 'topological sort' },
  { name: '최단 경로', topic: 'shortest path' },
  { name: '최소 신장 트리', topic: 'minimum spanning tree' },
  { name: '네트워크 플로우', topic: 'network flow' },
  { name: '문자열 매칭', topic: 'string matching' },
  { name: '볼록 껍질', topic: 'convex hull' },
  { name: '계산 기하학', topic: 'computational geometry' },
  { name: '게임 이론', topic: 'game theory' },
  { name: '조합론', topic: 'combinatorics' },
  { name: '확률', topic: 'probability' },
  { name: '정수론', topic: 'number theory' },
  { name: '조합 게임 이론', topic: 'combinatorial game theory' },
]

const MainPage: React.FC = () => {
  const router = useRouter()

  const handleAlgorithmClick = (topic: string) => {
    // 사용자가 선택한 알고리즘으로 문제 페이지로 이동
    router.push(`/problem/${topic}`)
  }

  return (
    <div style={{ margin: '0 auto', padding: '2rem', alignItems: 'center' }}>
      <div className="px-18 my-10 flex flex-row justify-center">
        <Image src="/images/logo.png" alt="logo" width={200} height={200} />
        <div className="flex flex-col items-center">
          <h1 className="p-4 text-center text-6xl">
            알고리즘 실력 향상을 위한 <br /> 맞춤형 학습 플랫폼
          </h1>
          <button>오늘의 문제 풀이</button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {algorithms.map(algorithm => (
          <button
            key={algorithm.topic}
            onClick={() => handleAlgorithmClick(algorithm.topic)}
            className="rounded-lg border border-gray-300 p-4">
            {algorithm.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MainPage
