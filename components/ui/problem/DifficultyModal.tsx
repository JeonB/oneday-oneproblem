import React from 'react'

interface DifficultyModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectDifficulty: (difficulty: string) => void
}

const DifficultyModal: React.FC<DifficultyModalProps> = ({
  isOpen,
  onClose,
  onSelectDifficulty,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-white">난이도 선택</h2>
        <div className="flex flex-col space-y-4">
          {/* Easy */}
          <label className="relative flex cursor-pointer items-center">
            <input
              className="peer sr-only"
              name="difficulty"
              type="radio"
              onClick={() => onSelectDifficulty('easy')}
            />
            <div className="h-6 w-6 rounded-full border-2 border-green-500 bg-transparent transition duration-300 ease-in-out peer-checked:border-green-500 peer-checked:bg-green-500 peer-checked:shadow-lg peer-checked:shadow-green-500/50 peer-hover:shadow-lg peer-hover:shadow-green-500/50"></div>
            <span className="ml-2 text-white">Easy</span>
          </label>

          {/* Normal */}
          <label className="relative flex cursor-pointer items-center">
            <input
              className="peer sr-only"
              name="difficulty"
              type="radio"
              onClick={() => onSelectDifficulty('normal')}
            />
            <div className="h-6 w-6 rounded-full border-2 border-yellow-500 bg-transparent transition duration-300 ease-in-out peer-checked:border-yellow-500 peer-checked:bg-yellow-500 peer-checked:shadow-lg peer-checked:shadow-yellow-500/50 peer-hover:shadow-lg peer-hover:shadow-yellow-500/50"></div>
            <span className="ml-2 text-white">Normal</span>
          </label>

          {/* Hard */}
          <label className="relative flex cursor-pointer items-center">
            <input
              className="peer sr-only"
              name="difficulty"
              type="radio"
              onClick={() => onSelectDifficulty('hard')}
            />
            <div className="h-6 w-6 rounded-full border-2 border-red-500 bg-transparent transition duration-300 ease-in-out peer-checked:border-red-500 peer-checked:bg-red-500 peer-checked:shadow-lg peer-checked:shadow-red-500/50 peer-hover:shadow-lg peer-hover:shadow-red-500/50"></div>
            <span className="ml-2 text-white">Hard</span>
          </label>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-600">
          닫기
        </button>
      </div>
    </div>
  )
}

export default DifficultyModal
