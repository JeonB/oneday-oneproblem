import * as cheerio from 'cheerio'
import { AiGeneratedContent } from '@/components/context/Store'

export const parseInputOutputExamples = (generatedProblem: string) => {
  const $ = cheerio.load(generatedProblem)

  const title = $('h1').first().text().trim() || 'Untitled'

  const inputOutputExampleHeader = $('h3').filter((_, el) =>
    $(el).text().includes('입출력 예시'),
  )

  const inputOutputExampleElement = inputOutputExampleHeader.next()

  const inputOutputExample = inputOutputExampleElement.text().trim()

  const examples: AiGeneratedContent[] = []
  const blocks = inputOutputExample.split(/\n\s*\n/).filter(Boolean)
  blocks.forEach(block => {
    const lines = block
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)

    const output = lines.pop() || ''
    const input = lines

    examples.push({ input, output })
  })

  return { title, examples }
}
