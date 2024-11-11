'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { generateProblem } from '../../utils/generateProblem.mjs'
import CodeEditor from '@/components/CodeEditor'
import ResultDisplay from '@/components/ResultDisplay'
import { useCode } from '@/components/context/CodeContext'

const cleanHTMLResponse = (response: string) => {
  // ```html와 같은 코드 태그 제거
  response = response.replace(/```html|```/g, '')

  // 특정 섹션들 간에만 줄바꿈을 추가하여 가독성 개선
  response = response.replaceAll(
    /(문제 설명|제한 사항|입출력 예시|입출력 예 설명|입출력 예:\s.*?)/g,
    '<br>$1<br><br>',
  )

  // 표의 셀에 Tailwind CSS 클래스 추가
  response = response.replace(
    /<table>/g,
    '<table class="table-auto w-full border-collapse">',
  )
  response = response.replace(/<th>/g, '<th class="px-4 py-2 border">')
  response = response.replace(/<td>/g, '<td class="px-4 py-2 border">')

  return response
}

//TODO: 입출력 예시 값 추출
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

        // 입출력 예시 추출
        const inputExampleHeader = Array.from(doc.querySelectorAll('h2')).find(
          element => element.textContent?.includes('입출력 예시'),
        )
        const inputExampleElement = inputExampleHeader?.nextElementSibling
        const inputExample = inputExampleElement
          ? inputExampleElement.textContent?.trim() || ''
          : ''

        console.log('입출력 예시:', inputExample)
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
