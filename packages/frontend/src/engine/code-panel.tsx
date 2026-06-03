import { useEffect, useRef } from 'react'
import { codeToHtml } from 'shiki'

interface Props {
  code: string
  activeLine: number
  language: string
}

export default function CodePanel({ code, activeLine, language }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const highlightedRef = useRef('')

  useEffect(() => {
    let cancelled = false
    const lang = language === 'python' ? 'python' : 'cpp'

    codeToHtml(code, {
      lang,
      theme: 'github-light-default',
    }).then(html => {
      if (cancelled) return
      highlightedRef.current = html
      if (containerRef.current) {
        containerRef.current.innerHTML = html
        applyHighlights(containerRef.current, activeLine)
      }
    })

    return () => { cancelled = true }
  }, [code, language])

  useEffect(() => {
    if (containerRef.current && highlightedRef.current) {
      applyHighlights(containerRef.current, activeLine)
    }
  }, [activeLine])

  // 滚动到当前行
  useEffect(() => {
    const el = containerRef.current?.querySelector('.line-highlighted')
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [activeLine])

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2.5 glass-light text-xs font-mono text-slate-500 border-b glass-border">
        {language === 'python' ? 'Python' : 'C++'}
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 text-sm leading-relaxed font-mono
          [&_pre]:!bg-transparent [&_code]:!bg-transparent
          [&_.line]:px-3 [&_.line]:py-0.5 [&_.line]:rounded-lg [&_.line]:transition-colors"
      />
    </div>
  )
}

function applyHighlights(container: HTMLElement, activeLine: number) {
  const lines = container.querySelectorAll('.line')
  lines.forEach(line => line.classList.remove('line-highlighted', 'bg-amber-50', 'border-l-2', 'border-amber-400'))

  // Shiki 的 line 从 0 开始编号，我们传入的 activeLine 从 1 开始
  const target = container.querySelector(`[data-line="${activeLine - 1}"]`) as HTMLElement | null
  if (target) {
    target.classList.add('line-highlighted', 'bg-amber-50', 'border-l-2', 'border-amber-400')
  }
}
