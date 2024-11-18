'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const algorithms = [
  { name: 'Sorting', topic: 'sorting' },
  { name: '선택 정렬', topic: 'Selection sort' },
  { name: '삽입 정렬', topic: 'Insertion sort' },
  { name: '버블 정렬', topic: 'Bubble sort' },
  { name: '병합 정렬', topic: 'Merge sort' },
  { name: '힙 정렬', topic: 'Heap sort' },
  { name: '퀵 정렬', topic: 'Quick sort' },
  { name: '트리 정렬', topic: 'Tree sort' },
  { name: 'Searching', topic: 'searching' },
  { name: 'Data Structures', topic: 'data structures' },
]

const MainPage: React.FC = () => {
  const router = useRouter()

  const handleAlgorithmClick = (topic: string) => {
    // 사용자가 선택한 알고리즘으로 문제 페이지로 이동
    router.push(`/problem/${topic}`)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Main Page</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {algorithms.map(algorithm => (
          <button
            key={algorithm.topic}
            onClick={() => handleAlgorithmClick(algorithm.topic)}
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}>
            {algorithm.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MainPage
