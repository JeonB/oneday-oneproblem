import { getUserFromToken } from '@/app/utils/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'

export type AiGeneratedContent = {
  input: string[] | string
  output: string | string[] | undefined
}

type User = { name: string } | null

interface ContextType {
  code: string
  setCode: (code: string) => void
  aiGeneratedContent: AiGeneratedContent[]
  setAiGeneratedContent: (content: AiGeneratedContent[]) => void
  user: User
  setUser: (user: User) => void
}
interface CodeProviderProps {
  children: React.ReactNode
  initialUser: User
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
export const OneDayProvider: React.FC<CodeProviderProps> = ({
  children,
  initialUser,
}) => {
  const [code, setCode] = useState(solution)
  const [aiGeneratedContent, setAiGeneratedContent] = useState<
    AiGeneratedContent[]
  >([])
  const [user, setUser] = useState<User>(initialUser)

  useEffect(() => {}, [user])
  return (
    <OneDayContext.Provider
      value={{
        code,
        setCode,
        aiGeneratedContent,
        setAiGeneratedContent,
        user,
        setUser,
      }}>
      {children}
    </OneDayContext.Provider>
  )
}
