import React, { createContext, useContext, useState } from 'react'

interface CodeContextType {
  code: string
  setCode: React.Dispatch<React.SetStateAction<string>>
  aiGeneratedContent: string
  setAiGeneratedContent: React.Dispatch<React.SetStateAction<string>>
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

export const CodeProvider: React.FC<CodeProviderProps> = ({ children }) => {
  const [code, setCode] = useState(`function solution(t,p)`)
  const [aiGeneratedContent, setAiGeneratedContent] = useState('')

  return (
    <CodeContext.Provider
      value={{ code, setCode, aiGeneratedContent, setAiGeneratedContent }}>
      {children}
    </CodeContext.Provider>
  )
}
