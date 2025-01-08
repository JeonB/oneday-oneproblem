'use client'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { generateProblem } from '@/app/lib/generateProblem'
import CodeEditor from '@/components/ui/problem/CodeEditor'
import CodeExecution from '@/components/ui/problem/CodeExecution'
import { useProblemStore, AiGeneratedContent } from '@/components/context/Store'
import LoadingPage from './loading-out'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

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
  const { content, setContent, setInputOutput, setDifficulty } =
    useProblemStore()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (topic) {
      const fetchProblem = async () => {
        setLoading(true)
        setError(null)
        try {
          const generatedProblem = await generateProblem(
            topic as string,
            difficulty,
          )
          if (typeof generatedProblem === 'string') {
            setContent(generatedProblem)

            const parser = new DOMParser()
            const doc = parser.parseFromString(generatedProblem, 'text/html')

            const inputOutputExampleHeader = Array.from(
              doc.querySelectorAll('h3'),
            ).find(element => element.textContent?.includes('입출력 예시'))

            const inputOutputExampleElement =
              inputOutputExampleHeader?.nextElementSibling
            const inputOutputExample = inputOutputExampleElement
              ? inputOutputExampleElement.textContent?.trim()
              : ''
            const inputOutput = parseInputOutputExamples(
              inputOutputExample || '',
            )

            // AI가 생성한 테스트 케이스를 저장
            setInputOutput(inputOutput)
          } else {
            throw new Error('Generated problem is not a string')
          }
        } catch (err) {
          setError('문제 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
          console.error('Error fetching problem:', err)
        } finally {
          setLoading(false)
        }
      }
      setDifficulty(difficulty)
      fetchProblem()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <PanelGroup direction="horizontal">
          <Panel defaultSizePercentage={40} minSizePercentage={30}>
            <div
              className="whitespace-normal p-4 text-left"
              dangerouslySetInnerHTML={{ __html: content }}></div>
          </Panel>
          <PanelResizeHandle className="h-screen w-1 bg-stone-400" />
          <Panel defaultSizePercentage={60} minSizePercentage={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSizePercentage={60} minSizePercentage={30}>
                <CodeEditor />
              </Panel>
              <PanelResizeHandle className="h-1 w-full bg-stone-400" />
              <Panel defaultSizePercentage={40} minSizePercentage={30}>
                <div className="p-4">
                  <h3 className="mb-2">실행 결과</h3>
                  <CodeExecution />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      )}
    </>
  )
}

export default ProblemPage
