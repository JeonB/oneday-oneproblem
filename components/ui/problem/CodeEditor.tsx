import React, { useState, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { python } from '@codemirror/lang-python'
import { useProblemStore } from '@/components/context/Store'

export default function CodeEditor() {
  const { userSolution, setUserSolution, content, inputOutput } =
    useProblemStore()
  const [language, setLanguage] = useState('javascript')

  const onChange = (value: string) => {
    setUserSolution(value)
  }

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLanguage(event.target.value)
  }

  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript':
        return javascript({ jsx: true })
      case 'java':
        return java()
      case 'c':
      case 'cpp':
        return cpp()
      case 'python':
        return python()
      default:
        return javascript({ jsx: true })
    }
  }

  useEffect(() => {
    if ((userSolution && userSolution.length > 0) || !inputOutput) return
    const template = `function solution(${inputOutput[0].input}){

}`
    setUserSolution(template)
  }, [inputOutput, setUserSolution, userSolution])

  return (
    <div>
      <select value={language} onChange={handleLanguageChange}>
        <option value="javascript">JavaScript</option>
        <option value="java">Java</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="python">Python</option>
      </select>
      <CodeMirror
        value={userSolution}
        onChange={onChange}
        height="70vh"
        theme="dark"
        extensions={[getLanguageExtension()]}
      />
    </div>
  )
}
