import { useEffect, useRef, useMemo } from 'react'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import cpp from 'highlight.js/lib/languages/cpp'

hljs.registerLanguage('python', python)
hljs.registerLanguage('cpp', cpp)

interface Props {
  code: string
  activeLine: number
  language: string
}

export default function CodePanel({ code, activeLine, language }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<Map<number, HTMLElement>>(new Map())

  const lang = language === 'python' ? 'python' : 'cpp'

  const highlighted = useMemo(() => {
    if (!code) return ''
    const result = hljs.highlight(code, { language: lang })
    const lines = result.value.split('\n')
    return lines
      .map((line, i) =>
        `<span class="line block px-3 py-0.5 rounded-lg transition-colors cursor-default" data-line="${i}">${line || '&nbsp;'}</span>`
      )
      .join('')
  }, [code, lang])

  useEffect(() => {
    if (!containerRef.current) return
    lineRefs.current.clear()
    containerRef.current.querySelectorAll('.line').forEach(el => {
      const line = Number((el as HTMLElement).dataset.line)
      if (!isNaN(line)) lineRefs.current.set(line, el as HTMLElement)
    })
  }, [highlighted])

  useEffect(() => {
    lineRefs.current.forEach(el => {
      el.classList.remove('bg-amber-50', 'dark:bg-amber-900/30', 'border-l-2', 'border-amber-400')
    })
    const target = lineRefs.current.get(activeLine - 1)
    if (target) {
      target.classList.add('bg-amber-50', 'dark:bg-amber-900/30', 'border-l-2', 'border-amber-400')
      target.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [activeLine, highlighted])

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2.5 glass-light text-xs font-mono text-slate-500 dark:text-gray-400 border-b glass-border">
        {language === 'python' ? 'Python' : 'C++'}
      </div>
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: highlighted }}
        className="flex-1 overflow-auto p-4 text-sm leading-relaxed font-mono
          bg-white/50 dark:bg-gray-900/50
          [&_.hljs-keyword]:text-purple-600 dark:[&_.hljs-keyword]:text-purple-400
          [&_.hljs-string]:text-green-600 dark:[&_.hljs-string]:text-green-400
          [&_.hljs-number]:text-amber-600 dark:[&_.hljs-number]:text-amber-400
          [&_.hljs-comment]:text-slate-400 dark:[&_.hljs-comment]:text-slate-500
          [&_.hljs-function]:text-blue-600 dark:[&_.hljs-function]:text-blue-400
          [&_.hljs-built_in]:text-cyan-600 dark:[&_.hljs-built_in]:text-cyan-400
          [&_.hljs-type]:text-teal-600 dark:[&_.hljs-type]:text-teal-400
          [&_.hljs-meta]:text-rose-600 dark:[&_.hljs-meta]:text-rose-400
          [&_.hljs-title]:text-blue-600 dark:[&_.hljs-title]:text-blue-400"
      />
    </div>
  )
}
