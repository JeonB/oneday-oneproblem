'use client'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { generateProblem } from '../../utils/generateProblem.mjs'
import CodeEditor from '@/components/CodeEditor'
import ResultDisplay from '@/components/ResultDisplay'
import { CodeProvider } from '@/components/context/CodeContext'

const ProblemPage: React.FC = () => {
  const searchParams = useParams()
  const topic = searchParams['topic']

  const [problem, setProblem] = useState<string>('')

  useEffect(() => {
    if (topic) {
      const fetchProblem = async () => {
        const generatedProblem = await generateProblem(topic as string)
        setProblem(JSON.stringify(generatedProblem))
      }
      fetchProblem()
    }
  }, [topic])

  return (
    <CodeProvider>
      <div className="grid h-screen grid-cols-2">
        <div className="whitespace-pre-wrap p-4 text-left">{problem}</div>
        <div className="flex flex-col p-4">
          <CodeEditor />
          <ResultDisplay />
        </div>
      </div>
    </CodeProvider>
  )
}

export default ProblemPage
