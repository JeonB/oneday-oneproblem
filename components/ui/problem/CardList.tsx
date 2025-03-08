'use client'
import { Algorithm } from '@/app/lib/models/Algorithms'
import Card from './AlgorithmCard'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DifficultyModal from './DifficultyModal'
import { useProblemStore } from '@/components/context/Store'
export default function CardList({ algorithms }: { algorithms: Algorithm[] }) {
  const router = useRouter()

  const updateProblemStore = (algorithm: Algorithm) => {
    useProblemStore.setState({
      topic: algorithm.topic,
      content: '',
      userSolution: '',
    })
  }

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(
    null,
  )
  const [isModalOpen, setModalOpen] = useState(false)
  const handleSelectDifficulty = (difficulty: string) => {
    if (!selectedAlgorithm) return

    setModalOpen(false)
    updateProblemStore(selectedAlgorithm)
    router.push(`/problem/${selectedAlgorithm.topic}?difficulty=${difficulty}`)
  }
  return (
    <>
      {algorithms.map(algorithm => (
        <Card
          key={algorithm.topic}
          onClick={() => {
            setModalOpen(true)
            setSelectedAlgorithm(algorithm)
          }}
          topic={algorithm.topic}
          algorithm={algorithm.name}
          img={algorithm.img}
        />
      ))}

      <DifficultyModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelectDifficulty={handleSelectDifficulty}
      />
    </>
  )
}
