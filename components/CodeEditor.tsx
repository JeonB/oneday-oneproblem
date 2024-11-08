import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { python } from '@codemirror/lang-python'
import { useCode } from './context/CodeContext'

export default function CodeEditor() {
  const codeContext = useCode()
  const { code, setCode } = codeContext
  const [language, setLanguage] = useState('javascript')

  const onChange = (value: string) => {
    setCode(value)
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
        value={code}
        onChange={onChange}
        height="70vh"
        theme="dark"
        extensions={[getLanguageExtension()]}
      />
    </div>
  )
}
