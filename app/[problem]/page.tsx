// pages/index.tsx
import { useRouter } from 'next/router'
import React from 'react'

const algorithms = [
  { name: 'Sorting', topic: 'sorting' },
  { name: 'Searching', topic: 'searching' },
  { name: 'Data Structures', topic: 'data structures' },
  // 필요한 알고리즘 항목 추가
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
