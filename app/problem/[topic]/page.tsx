'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { generateProblem } from '../../utils/generateProblem.mjs'
import CodeEditor from '@/components/CodeEditor'
import ResultDisplay from '@/components/ResultDisplay'
import { CodeProvider } from '@/components/context/CodeContext'

const cleanHTMLResponse = (response: string) => {
  // ```html와 같은 코드 태그 제거
  response = response.replace(/```html|```/g, '')

  // 연속된 줄바꿈을 하나의 줄바꿈으로 줄이고, 불필요한 공백 제거
  // response = response.replace(/\n\s*\n/g, '').trim()

  // 특정 섹션들 간에만 줄바꿈을 추가하여 가독성 개선
  response = response.replaceAll(
    /(문제 설명|입력 조건|출력 조건|입력 예시|출력 예시|추가 설명|문제:\s.*?)/g,
    '<br>$1<br><br>',
  )

  return response
}

const ProblemPage: React.FC = () => {
  const searchParams = useParams()
  const topic = searchParams['topic']

  const [problem, setProblem] = useState<string>('')

  useEffect(() => {
    if (topic) {
      const fetchProblem = async () => {
        const generatedProblem = await generateProblem(topic as string)
        const cleanedProblem = generatedProblem
          ? cleanHTMLResponse(generatedProblem)
          : ''
        setProblem(cleanedProblem)
      }
      fetchProblem()
    }
  }, [topic])
  return (
    <CodeProvider>
      <div className="grid h-screen grid-cols-2">
        <div
          className="whitespace-normal p-4 text-left"
          dangerouslySetInnerHTML={{ __html: problem }}></div>
        <div className="flex flex-col p-4">
          <CodeEditor />
          <ResultDisplay />
        </div>
      </div>
    </CodeProvider>
  )
}

export default ProblemPage
