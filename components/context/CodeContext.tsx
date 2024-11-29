import React, { createContext, useContext, useState } from 'react'

export type AiGeneratedContent = {
  input: string[] | string
  output: string | string[] | undefined
}

interface CodeContextType {
  code: string
  setCode: (code: string) => void
  aiGeneratedContent: AiGeneratedContent[]
  setAiGeneratedContent: (content: AiGeneratedContent[]) => void
}
interface CodeProviderProps {
  children: React.ReactNode
}
const CodeContext = createContext<CodeContextType | null>(null)

export const useCode = () => {
  const context = useContext(CodeContext)
  if (!context) {
    throw new Error('useCodeContext must be used within a CodeProvider')
  }
  return context
}

const solution = `function solution(){
  return 0;
}`
export const CodeProvider: React.FC<CodeProviderProps> = ({ children }) => {
  const [code, setCode] = useState(solution)
  const [aiGeneratedContent, setAiGeneratedContent] = useState<
    AiGeneratedContent[]
  >([])

  return (
    <CodeContext.Provider
      value={{ code, setCode, aiGeneratedContent, setAiGeneratedContent }}>
      {children}
    </CodeContext.Provider>
  )
}
