'use client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { generateProblem } from '../../utils/generateProblem.mjs'
import CodeEditor from '@/components/CodeEditor'
import ResultDisplay from '@/components/ResultDisplay'
import { CodeProvider } from '@/components/context/CodeContext'

const ProblemPage: React.FC = () => {
  const router = useRouter()
  const { topic } = router.query
  const [problem, setProblem] = useState<string>('')

  useEffect(() => {
    if (topic) {
      const fetchProblem = async () => {
        const generatedProblem = await generateProblem(topic as string)
        setProblem(generatedProblem)
      }
      fetchProblem()
    }
  }, [topic])

  return (
    <CodeProvider>
      <div className="grid h-screen grid-cols-2">
        <div>{problem}</div>
        <div className="flex flex-col p-4">
          <CodeEditor />
          <ResultDisplay />
        </div>
      </div>
    </CodeProvider>
  )
}

export default ProblemPage
