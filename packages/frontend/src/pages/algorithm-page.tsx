import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { registry } from '../registry'
import Player from '../engine/player'

export default function AlgorithmPage() {
  const { algoId } = useParams<{ algoId: string }>()
  const algorithm = registry.find(a => a.meta.id === algoId)
  const [showIntro, setShowIntro] = useState(true)

  // 重置介绍显示状态
  useEffect(() => { setShowIntro(true) }, [algoId])

  if (!algorithm) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <p className="text-slate-400 dark:text-gray-400 text-lg">算法 "{algoId}" 未找到</p>
        <Link to="/" className="text-indigo-500 hover:underline text-sm">返回首页</Link>
      </div>
    )
  }

  const { meta } = algorithm

  return (
    <div className="h-full flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center gap-3 px-5 py-2.5 shrink-0">
        <Link to="/" className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
        </Link>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{meta.title}</h1>
        <span className="text-xs px-2 py-0.5 rounded-full glass-light text-slate-500 dark:text-gray-400">
          {meta.complexity.time}
        </span>
        <span className="text-xs text-amber-400">
          {'\u2B50'.repeat(meta.difficulty)}
        </span>
        {meta.description && (
          <button
            onClick={() => setShowIntro(!showIntro)}
            className="ml-auto text-xs px-3 py-1 rounded-xl glass-light hover:bg-white/30 dark:hover:bg-gray-700/40 transition-colors text-slate-500 dark:text-gray-400 shrink-0"
          >
            {showIntro ? '收起' : '原理'}
          </button>
        )}
      </div>

      {/* 算法原理描述 */}
      {showIntro && meta.description && (
        <div className="px-5 pb-3 shrink-0">
          <div className="glass-elevated rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-gray-300 leading-relaxed max-h-[6rem] overflow-y-auto whitespace-pre-line">
            {meta.description}
          </div>
        </div>
      )}

      <Player algorithm={algorithm} />
    </div>
  )
}
