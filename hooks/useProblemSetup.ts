import { useState, useEffect } from 'react'
import { parseInputOutputExamples } from '@/app/lib/parseProblem'
import { useProblemStore } from '@/components/context/Store'
import { AiGeneratedContent } from '@/components/context/StoreContext'

export const useProblemSetup = (initialContent: string, difficulty: string) => {
  const { content, setContent, setTitle, setInputOutput, setDifficulty } =
    useProblemStore()

  const [parsedData, setParsedData] = useState<{
    title: string
    examples: AiGeneratedContent[]
  }>({ title: '', examples: [] })
  const [initialInput, setInitialInput] = useState<string | string[]>('')

  useEffect(() => {
    if (!parsedData.examples.length) {
      const parsed = parseInputOutputExamples(initialContent)
      setParsedData(parsed)

      if (parsed.examples.length > 0) {
        setInitialInput(parsed.examples[0].input)
      }
    }
  }, [initialContent, parsedData])

  useEffect(() => {
    if (!content && parsedData.examples.length > 0) {
      setContent(initialContent)
      setTitle(parsedData.title)
      setInputOutput(parsedData.examples)
      setDifficulty(difficulty)
    }
  }, [
    content,
    difficulty,
    initialContent,
    parsedData,
    setContent,
    setDifficulty,
    setInputOutput,
    setTitle,
  ])

  return { content, initialInput }
}
