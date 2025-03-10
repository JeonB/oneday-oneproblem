import React, { useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { python } from '@codemirror/lang-python'
import { useProblemStore } from '@/components/context/Store'
import { abcdef } from '@uiw/codemirror-themes-all'

export default function CodeEditor({
  initialInput,
}: {
  initialInput: string | string[]
}) {
  const setUserSolution = useProblemStore(set => set.setUserSolution)
  const userSolution = useProblemStore(state => state.userSolution)
  const [language, setLanguage] = useState('javascript')
  const [template, setTemplate] = useState('')

  useEffect(() => {
    if (initialInput) {
      const inputString = Array.isArray(initialInput)
        ? initialInput.join(', ')
        : initialInput

      setTemplate(`function solution(${inputString}){\n\n}`)
    }
  }, [initialInput])

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
        value={userSolution || template}
        onChange={onChange}
        theme={abcdef}
        extensions={[getLanguageExtension()]}
      />
    </div>
  )
}
