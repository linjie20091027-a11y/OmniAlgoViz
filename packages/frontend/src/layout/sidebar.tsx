import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registry } from '../registry'

const CATEGORY_NAMES: Record<string, string> = {
  'sorting':          '排序算法',
  'data-structure':   '数据结构',
  'fundamental':      '基础算法',
  'graph':            '图论算法',
  'dp':               '动态规划',
  'math':             '数学/数论',
  'string':           '字符串算法',
  'search':           '搜索算法',
  'geometry':         '计算几何',
}

export default function Sidebar({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const categories = useMemo(() => {
    const map = new Map<string, typeof registry>()
    for (const algo of registry) {
      const list = map.get(algo.meta.category) || []
      list.push(algo)
      map.set(algo.meta.category, list)
    }
    return [...map.entries()]
  }, [])

  return (
    <aside className="w-64 glass border-r glass-border flex flex-col shrink-0 z-10
      dark:bg-gray-900/60 dark:border-gray-700/30 dark:text-gray-200">
      <div className="px-6 py-5 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-left">
          <span className="text-xl font-light tracking-tight dark:text-white">
            Omni<span className="font-semibold">Algo</span>Viz
          </span>
        </button>
        <button
          onClick={onToggleDark}
          className="p-1.5 rounded-lg hover:bg-white/30 dark:hover:bg-gray-700/50 transition-colors"
          title={dark ? '切换到浅色模式' : '切换到深色模式'}
        >
          {dark ? (
            <svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      <div className="glass-divider mx-4 dark:opacity-30" />

      <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {categories.map(([cat, algos]) => {
          const open = expanded[cat] ?? true
          return (
            <div key={cat}>
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [cat]: !open }))}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium
                  text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200
                  hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {CATEGORY_NAMES[cat] || cat}
                <svg className={`w-3.5 h-3.5 transition-transform ${open ? '' : '-rotate-90'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {open && (
                <div className="ml-2 space-y-0.5">
                  {algos.map(algo => (
                    <button
                      key={algo.meta.id}
                      onClick={() => navigate(`/algorithm/${algo.meta.id}`)}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-gray-400
                        hover:text-slate-900 dark:hover:text-gray-100 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors"
                    >
                      {algo.meta.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
