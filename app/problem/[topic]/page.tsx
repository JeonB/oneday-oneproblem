'use client'
import { useParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { generateProblem } from '../../utils/generateProblem.mjs'
import CodeEditor from '@/components/CodeEditor'
import ResultDisplay from '@/components/ResultDisplay'
import { useCode, AiGeneratedContent } from '@/components/context/CodeContext'
import LoadingPage from './loading-out'

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

const parseInputOutputExamples = (inputOutputExample: string) => {
  const examples: AiGeneratedContent[] = []

  // 블록 단위로 분리 (빈 줄 기준으로 구분)
  const blocks = inputOutputExample.split(/\n\s*\n/).filter(Boolean)

  blocks.forEach(block => {
    // 각 블록을 줄 단위로 나누고, 공백 라인을 제거
    const lines = block
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)

    // 마지막 줄은 출력값으로, 나머지 줄은 입력값으로 설정
    const output = lines.pop()
    const input = lines

    // input이 배열의 형태로 변환될 수 있게 함
    examples.push({ input, output })
  })

  return examples
}

const ProblemPage = () => {
  const searchParams = useParams()
  const topic = searchParams['topic']
  const { setAiGeneratedContent } = useCode()
  const [problem, setProblem] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (topic) {
      const fetchProblem = async () => {
        setLoading(true)
        const generatedProblem = await generateProblem(topic as string)
        const cleanedProblem = generatedProblem
          ? cleanHTMLResponse(generatedProblem)
          : ''
        setProblem(cleanedProblem)
        const parser = new DOMParser()
        const doc = parser.parseFromString(cleanedProblem, 'text/html')

        // 입출력 예시 추출
        const inputOutputExampleHeader = Array.from(
          doc.querySelectorAll('h2'),
        ).find(element => element.textContent?.includes('입출력 예시'))
        const inputOutputExampleElement =
          inputOutputExampleHeader?.nextElementSibling
        const inputOutputExample = inputOutputExampleElement
          ? inputOutputExampleElement.textContent?.trim()
          : ''
        const inputOutput = parseInputOutputExamples(inputOutputExample || '')
        // AI가 생성한 내용을 상태로 설정
        setAiGeneratedContent(inputOutput)
        setLoading(false)
      }

      fetchProblem()
    }
  }, [topic])
  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="grid h-screen grid-cols-2">
          <div
            className="whitespace-normal p-4 text-left"
            dangerouslySetInnerHTML={{ __html: problem }}></div>
          <div className="flex flex-col p-4">
            <CodeEditor />
            <ResultDisplay />
          </div>
        </div>
      )}
    </>
  )
}

export default ProblemPage
