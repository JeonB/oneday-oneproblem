'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const algorithms = [
  { name: 'Sorting', topic: 'sorting' },
  { name: 'Searching', topic: 'searching' },
  { name: 'Data Structures', topic: 'data structures' },
  { name: 'Dynamic Programming', topic: 'dynamic programming' },
  { name: 'Graph', topic: 'graph' },
  { name: 'Greedy', topic: 'greedy' },
  { name: 'Backtracking', topic: 'backtracking' },
  { name: 'Bit Manipulation', topic: 'bit manipulation' },
  { name: 'Math', topic: 'math' },
  { name: 'String', topic: 'string' },
  { name: 'Geometry', topic: 'geometry' },
  { name: 'Tree', topic: 'tree' },
  { name: 'Hashing', topic: 'hashing' },
  { name: 'Stack', topic: 'stack' },
  { name: 'Queue', topic: 'queue' },
  { name: 'Heap', topic: 'heap' },
  { name: 'Linked List', topic: 'linked list' },
  { name: 'Trie', topic: 'trie' },
  { name: 'Segment Tree', topic: 'segment tree' },
  { name: 'Binary Search Tree', topic: 'binary search tree' },
  { name: 'Disjoint Set', topic: 'disjoint set' },
  { name: 'Fenwick Tree', topic: 'fenwick tree' },
  { name: 'Suffix Array', topic: 'suffix array' },
  { name: 'Topological Sort', topic: 'topological sort' },
  { name: 'Shortest Path', topic: 'shortest path' },
  { name: 'Minimum Spanning Tree', topic: 'minimum spanning tree' },
  { name: 'Network Flow', topic: 'network flow' },
  { name: 'String Matching', topic: 'string matching' },
  { name: 'Convex Hull', topic: 'convex hull' },
  { name: 'Computational Geometry', topic: 'computational geometry' },
  { name: 'Game Theory', topic: 'game theory' },
  { name: 'Combinatorics', topic: 'combinatorics' },
  { name: 'Probability', topic: 'probability' },
  { name: 'Number Theory', topic: 'number theory' },
  { name: 'Combinatorial Game Theory', topic: 'combinatorial game theory' },
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
