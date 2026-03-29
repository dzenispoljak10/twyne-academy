'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Button from '@/components/ui/Button'
import { Play, Eye } from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface LessonCodeProps {
  content: Record<string, unknown>
  locale: string
}

export default function LessonCode({ content, locale }: LessonCodeProps) {
  const language = (content.language as string) ?? 'javascript'
  const starterCode = (content.starterCode as string) ?? ''
  const solution = content.solution as string | undefined
  const instructions = (content.instructions as string) ?? ''

  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const runCode = async () => {
    setRunning(true)
    setAttempts((a) => a + 1)
    try {
      if (language === 'javascript' || language === 'js') {
        const logs: string[] = []
        const originalLog = console.log
        console.log = (...args) => logs.push(args.map(String).join(' '))
        try {
          // eslint-disable-next-line no-new-func
          new Function(code)()
        } catch (e) {
          logs.push(`Error: ${(e as Error).message}`)
        }
        console.log = originalLog
        setOutput(logs.join('\n') || '(no output)')
      } else {
        setOutput(
          locale === 'en'
            ? `Code execution for ${language} is simulated in this demo.`
            : `Code-Ausführung für ${language} wird in dieser Demo simuliert.`
        )
      }
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-4">
      {instructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          {instructions}
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-neutral-200">
        <div className="bg-neutral-800 px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-mono">{language}</span>
          <div className="flex gap-2">
            {solution && attempts >= 3 && !showSolution && (
              <Button size="sm" variant="ghost" className="text-neutral-300 hover:text-white" onClick={() => setShowSolution(true)}>
                <Eye className="h-4 w-4" />
                {locale === 'en' ? 'Show solution' : 'Lösung zeigen'}
              </Button>
            )}
            <Button size="sm" onClick={runCode} loading={running} className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4" />
              {locale === 'en' ? 'Run' : 'Ausführen'}
            </Button>
          </div>
        </div>
        <MonacoEditor
          height="300px"
          language={language}
          value={showSolution ? solution : code}
          onChange={(v) => setCode(v ?? '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            readOnly: showSolution,
          }}
        />
      </div>

      {output && (
        <div className="bg-neutral-900 rounded-xl p-4">
          <div className="text-xs text-neutral-400 mb-2 font-mono">Output:</div>
          <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  )
}
