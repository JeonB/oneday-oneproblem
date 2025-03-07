'use client'
import { Algorithm } from '@/app/lib/models/Algorithms'
import Card from './AlgorithmCard'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DifficultyModal from './DifficultyModal'
import { useProblemStore } from '@/components/context/Store'
export default function CardList({ algorithms }: { algorithms: Algorithm[] }) {
  const router = useRouter()
  const setTopic = useProblemStore(state => state.setTopic)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(
    null,
  )
  const [isModalOpen, setModalOpen] = useState(false)
  const handleSelectDifficulty = (difficulty: string) => {
    setModalOpen(false)
    setTopic(selectedAlgorithm?.name || '')
    router.push(`/problem/${selectedAlgorithm?.topic}?difficulty=${difficulty}`)
  }
  return (
    <>
      <div className="mb-10 flex justify-center">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {algorithms.map(algorithm => (
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

      <DifficultyModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelectDifficulty={handleSelectDifficulty}
      />
    </>
  )
}
