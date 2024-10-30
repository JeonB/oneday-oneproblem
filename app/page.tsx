'use client'
import ProblemDescription from '@/components/ProblemDescription'
import CodeEditor from '@/components/CodeEditor'
import ResultDisplay from '@/components/ResultDisplay'
import { CodeProvider } from '@/components/context/CodeContext'

export default function Home() {
  return (
    <CodeProvider>
      <div className="grid h-screen grid-cols-2">
        <div>
          <ProblemDescription />
        </div>
        <div className="flex flex-col p-4">
          <CodeEditor />
          <ResultDisplay />
        </div>
      </div>
    </CodeProvider>
  )
}
