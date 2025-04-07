'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useProblemStore } from '@/components/context/StoreContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { python } from '@codemirror/lang-python'
import { abcdef } from '@uiw/codemirror-themes-all'

function ProblemDetailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const topic = searchParams.get('topic')
  const difficulty = searchParams.get('difficulty')

  const content = useProblemStore(state => state.content)
  const userSolution = useProblemStore(state => state.userSolution)

  const [language, setLanguage] = useState('javascript')

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

  if (!content || !userSolution) {
    return (
      <div className="container mx-auto flex h-[80vh] flex-col items-center justify-center px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로 가기
          </Button>
          <h1 className="text-2xl font-bold">
            {topic} - {difficulty}
          </h1>
        </div>
        <div className="rounded-lg bg-gray-800 p-8 text-center shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-red-400">
            데이터를 불러올 수 없습니다
          </h2>
          <p className="mb-6 text-gray-300">
            문제 내용이나 사용자 풀이를 불러오는 데 문제가 발생했습니다. 프로필
            페이지로 돌아가 다시 시도해주세요.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/profile')}
            className="bg-gray-700 text-gray-200 hover:bg-gray-600">
            프로필 페이지로 이동
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        <h1 className="text-2xl font-bold">
          {topic} - {difficulty}
        </h1>
      </div>

      <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">문제 내용</h2>
        <div
          className="prose prose-invert max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="rounded-lg bg-gray-800 p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">내 풀이</h2>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="rounded-md bg-gray-700 px-3 py-1 text-sm text-gray-200">
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
        </div>
        <div className="overflow-hidden rounded-md border border-gray-700">
          <CodeMirror
            value={userSolution}
            theme={abcdef}
            extensions={[getLanguageExtension()]}
            editable={false}
            height="300px"
          />
        </div>
      </div>
    </div>
  )
}

export default function ProblemDetailPage() {
  return (
    <Suspense>
      <ProblemDetailContent />
    </Suspense>
  )
}
