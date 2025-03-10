'use client'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { generateProblem } from '@/app/lib/generateProblem'
import CodeEditor from '@/components/ui/problem/CodeEditor'
import CodeExecution from '@/components/ui/problem/CodeExecution'
import { useProblemStore, AiGeneratedContent } from '@/components/context/Store'
import LoadingPage from './loading'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import Link from 'next/link'
import logoImg from '@/public/images/logo.png'
import Image from 'next/image'

const parseInputOutputExamples = (generatedProblem: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(generatedProblem, 'text/html')

  const inputOutputExampleHeader = Array.from(doc.querySelectorAll('h3')).find(
    element => element.textContent?.includes('입출력 예시'),
  )
  const titleElement = doc.querySelector('h1')
  const title = titleElement?.textContent?.trim() || 'Untitled'
  const inputOutputExampleElement = inputOutputExampleHeader?.nextElementSibling
  const inputOutputExample = inputOutputExampleElement
    ? inputOutputExampleElement.textContent?.trim()
    : ''

  const examples: AiGeneratedContent[] = []
  const blocks = (inputOutputExample || '').split(/\n\s*\n/).filter(Boolean)
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
  return { title, examples }
}

const ProblemPage = () => {
  const { topic } = useParams()
  const searchParams = useSearchParams()
  const difficulty = searchParams.get('difficulty') || 'normal'
  const {
    setTitle,
    content,
    setContent,
    setInputOutput,
    setDifficulty,
    setUserSolution,
  } = useProblemStore()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeContent = async () => {
      setLoading(true)
      try {
        let generatedProblem: string

        if (!content) {
          const result = await generateProblem(topic as string, difficulty)
          if (result instanceof Error) {
            throw result
          }
          generatedProblem = result
          setUserSolution('')
        } else {
          generatedProblem = content
        }

        if (typeof generatedProblem === 'string') {
          setContent(generatedProblem)
          const inputOutput = parseInputOutputExamples(generatedProblem)
          setInputOutput(inputOutput.examples)
          setTitle(inputOutput.title)
          setDifficulty(difficulty)
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

    initializeContent()
  }, [
    content,
    difficulty,
    setContent,
    setDifficulty,
    setInputOutput,
    setTitle,
    setUserSolution,
    topic,
  ])

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <PanelGroup direction="horizontal">
          <Panel defaultSizePercentage={40} minSizePercentage={30}>
            <div className="flex h-screen flex-col">
              <div className="flex-grow overflow-auto whitespace-normal p-4 text-left">
                <Link href="/" className="py-4 text-xl font-bold">
                  <div className="mb-2 flex items-center gap-2">
                    <Image
                      src={logoImg}
                      alt="logo"
                      className="h-8 w-auto rounded-xl p-2 md:h-14 xl:h-16"
                    />
                    1일 1문제
                  </div>
                </Link>
                {/* 콘텐츠를 여기에 렌더링 */}
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="h-screen w-1 bg-stone-400" />
          <Panel defaultSizePercentage={60} minSizePercentage={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSizePercentage={60} minSizePercentage={10}>
                <div className="flex h-full overflow-hidden">
                  <div className="flex-1 overflow-auto">
                    <CodeEditor />
                  </div>
                </div>
              </Panel>
              <PanelResizeHandle className="h-1 w-full bg-stone-400" />
              <Panel defaultSizePercentage={40} minSizePercentage={10}>
                <div className="flex h-full overflow-hidden">
                  <div className="flex-1 overflow-auto p-4">
                    <h3 className="mb-2">실행 결과</h3>
                    <CodeExecution />
                  </div>
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
