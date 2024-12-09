'use client'
import React, { createContext, useContext, useState } from 'react'

export type AiGeneratedContent = {
  input: string[] | string
  output: string | string[] | undefined
}

interface ContextType {
  code: string
  setCode: (code: string) => void
  aiGeneratedContent: AiGeneratedContent[]
  setAiGeneratedContent: (content: AiGeneratedContent[]) => void
  loginState: boolean
  setLoginState: (state: boolean) => void
}
interface CodeProviderProps {
  children: React.ReactNode
}
const OneDayContext = createContext<ContextType | null>(null)

export const useStore = () => {
  const context = useContext(OneDayContext)
  if (!context) {
    throw new Error('useCodeContext must be used within a CodeProvider')
  }
  return context
}

const solution = `function solution(){
  return 0;
}`
export const OneDayProvider: React.FC<CodeProviderProps> = ({ children }) => {
  const [code, setCode] = useState(solution)
  const [aiGeneratedContent, setAiGeneratedContent] = useState<
    AiGeneratedContent[]
  >([])
  const [loginState, setLoginState] = useState(false)

  return (
    <OneDayContext.Provider
      value={{
        code,
        setCode,
        aiGeneratedContent,
        setAiGeneratedContent,
        loginState: loginState,
        setLoginState,
      }}>
      {children}
    </OneDayContext.Provider>
  )
}
