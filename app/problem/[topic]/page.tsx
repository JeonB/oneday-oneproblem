'use client'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { generateProblem } from '@/app/lib/generateProblem'
import CodeEditor from '@/components/ui/problem/CodeEditor'
import ResultDisplay from '@/components/ui/problem/ResultDisplay'
import { useStore, AiGeneratedContent } from '@/components/context/StoreContext'
import LoadingPage from './loading-out'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

const cleanHTMLResponse = (response: string) => {
  response = response.replace(/```html|```/g, '')
  response = response.replaceAll(
    /(문제 설명|제한 사항|입출력 예시|입출력 예 설명|입출력 예:\s.*?)/g,
    '<br>$1<br><br>',
  )
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
  const blocks = inputOutputExample.split(/\n\s*\n/).filter(Boolean)
  blocks.forEach(block => {
    const lines = block
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
    const output = lines.pop()
    const input = lines
    examples.push({ input, output })
  })
  return examples
}

const ProblemPage = () => {
  const { topic } = useParams()
  const searchParams = useSearchParams()
  const difficulty = searchParams.get('difficulty') || 'normal'
  const { setAiGeneratedContent } = useStore()
  const [problem, setProblem] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (topic) {
      const fetchProblem = async () => {
        setLoading(true)
        setError(null) // 초기화
        try {
          const generatedProblem = await generateProblem(
            topic as string,
            difficulty,
          )
          const cleanedProblem = generatedProblem
            ? cleanHTMLResponse(generatedProblem)
            : ''
          setProblem(cleanedProblem)

          const parser = new DOMParser()
          const doc = parser.parseFromString(cleanedProblem, 'text/html')

          // 입출력 예시 추출
          const inputOutputExampleHeader = Array.from(
            doc.querySelectorAll('h3'),
          ).find(element => element.textContent?.includes('입출력 예시'))

          const inputOutputExampleElement =
            inputOutputExampleHeader?.nextElementSibling
          const inputOutputExample = inputOutputExampleElement
            ? inputOutputExampleElement.textContent?.trim()
            : ''
          const inputOutput = parseInputOutputExamples(inputOutputExample || '')

          // AI가 생성한 내용을 상태로 설정
          setAiGeneratedContent(inputOutput)
        } catch (err) {
          setError('문제 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
          console.error('Error fetching problem:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchProblem()
    }
  }, [topic, setAiGeneratedContent, difficulty])

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <PanelGroup direction="horizontal">
          <Panel defaultSizePercentage={50} minSizePercentage={30}>
            <div
              className="whitespace-normal p-4 text-left"
              dangerouslySetInnerHTML={{ __html: problem }}></div>
          </Panel>
          <PanelResizeHandle className="h-screen w-1 bg-stone-400" />
          <Panel defaultSizePercentage={50} minSizePercentage={30}>
            <div className="flex flex-col p-4">
              <CodeEditor />
              <ResultDisplay />
            </div>
          </Panel>
        </PanelGroup>
      )}
    </>
  )
}

export default ProblemPage
