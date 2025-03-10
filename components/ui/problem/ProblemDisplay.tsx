'use client'

import { useProblemStore } from '@/components/context/Store'
import CodeEditor from '@/components/ui/problem/CodeEditor'
import CodeExecution from '@/components/ui/problem/CodeExecution'
import { parseInputOutputExamples } from '@/app/lib/parseProblem'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import Link from 'next/link'
import Image from 'next/image'
import logoImg from '@/public/images/logo.png'
import { useState, useEffect } from 'react'
import { AiGeneratedContent } from '@/components/context/StoreContext'
import { useProblemSetup } from '@/hooks/useProblemSetup'

const ProblemDisplay = ({
  difficulty,
  initialContent,
}: {
  difficulty: string
  initialContent: string
}) => {
  const { content, initialInput } = useProblemSetup(initialContent, difficulty)
  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSizePercentage={40} minSizePercentage={30}>
        <div className="flex h-screen flex-col">
          <div className="flex-grow overflow-auto p-4 text-left">
            <Link href="/" className="py-4 text-xl font-bold">
              <div className="mb-2 flex items-center gap-2">
                <Image
                  src={logoImg}
                  alt="logo"
                  className="h-8 w-auto rounded-xl p-2 md:h-14 xl:h-16"
                />
                1일 1문제
              </div>
            </Link>
            {/* 문제 콘텐츠 렌더링 */}
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="h-screen w-1 bg-stone-400" />
      <Panel defaultSizePercentage={60} minSizePercentage={30}>
        <PanelGroup direction="vertical">
          <Panel defaultSizePercentage={60} minSizePercentage={10}>
            <div className="flex h-full overflow-hidden">
              <div className="flex-1 overflow-auto">
                <CodeEditor initialInput={initialInput} />
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="h-1 w-full bg-stone-400" />
          <Panel defaultSizePercentage={40} minSizePercentage={10}>
            <div className="flex h-full overflow-hidden">
              <div className="flex-1 overflow-auto p-4">
                <h3 className="mb-2">실행 결과</h3>
                <CodeExecution />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  )
}

export default ProblemDisplay
