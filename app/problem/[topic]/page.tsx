'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { generateProblem } from '../../utils/generateProblem.mjs'
import CodeEditor from '@/components/CodeEditor'
import ResultDisplay from '@/components/ResultDisplay'
import { CodeProvider } from '@/components/context/CodeContext'
import { useCode } from '@/components/context/CodeContext'

const cleanHTMLResponse = (response: string) => {
  // ```html와 같은 코드 태그 제거
  response = response.replace(/```html|```/g, '')

  // 연속된 줄바꿈을 하나의 줄바꿈으로 줄이고, 불필요한 공백 제거
  // response = response.replace(/\n\s*\n/g, '').trim()

  // 특정 섹션들 간에만 줄바꿈을 추가하여 가독성 개선
  response = response.replaceAll(
    /(문제 설명|제한 사항|입출력 예시|입출력 예 설명|입출력 예:\s.*?)/g,
    '<br>$1<br><br>',
  )

  return response
}

const ProblemPage: React.FC = () => {
  const searchParams = useParams()
  const topic = searchParams['topic']
  const { setAiGeneratedContent } = useCode()
  const [problem, setProblem] = useState<string>('')
  useEffect(() => {
    if (topic) {
      const fetchProblem = async () => {
        const generatedProblem = await generateProblem(topic as string)
        const cleanedProblem = generatedProblem
          ? cleanHTMLResponse(generatedProblem)
          : ''
        setProblem(cleanedProblem)
        const parser = new DOMParser()
        const doc = parser.parseFromString(cleanedProblem, 'text/html')

        // 입력 예시 추출
        const inputExampleHeader = Array.from(doc.querySelectorAll('h2')).find(
          element => element.textContent?.includes('입력 예시'),
        )
        const inputExampleElement = inputExampleHeader?.nextElementSibling
        const inputExample = inputExampleElement
          ? inputExampleElement.textContent?.trim() || ''
          : ''

        // 출력 예시 추출
        const outputExampleHeader = Array.from(doc.querySelectorAll('h2')).find(
          element => element.textContent?.includes('출력 예시'),
        )
        const outputExampleElement = outputExampleHeader?.nextElementSibling
        const outputExample = outputExampleElement
          ? outputExampleElement.textContent?.trim() || ''
          : ''

        console.log('입력 예시:', inputExample)
        console.log('출력 예시:', outputExample)
      }

      fetchProblem()
    }
  }, [topic])
  return (
    <div className="grid h-screen grid-cols-2">
      <div
        className="whitespace-normal p-4 text-left"
        dangerouslySetInnerHTML={{ __html: problem }}></div>
      <div className="flex flex-col p-4">
        <CodeEditor />
        <ResultDisplay />
      </div>
    </div>
  )
}

export default ProblemPage
