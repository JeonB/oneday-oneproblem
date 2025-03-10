import { AiGeneratedContent } from '@/components/context/Store'

export const parseInputOutputExamples = (generatedProblem: string) => {
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
