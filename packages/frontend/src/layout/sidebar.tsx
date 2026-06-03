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

export default function Sidebar() {
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
    <aside className="w-64 glass border-r glass-border flex flex-col shrink-0 z-10">
      <div
        className="px-6 py-5 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <span className="text-xl font-light tracking-tight">
          Visual<span className="font-semibold">Algo</span>
        </span>
      </div>

      <div className="glass-divider mx-4" />

      <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {categories.map(([cat, algos]) => {
          const open = expanded[cat] ?? true
          return (
            <div key={cat}>
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [cat]: !open }))}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium
                  text-slate-500 hover:text-slate-700 hover:bg-white/50 transition-colors"
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
                      className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-600
                        hover:text-slate-900 hover:bg-white/60 transition-colors"
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
