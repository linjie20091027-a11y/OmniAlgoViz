import { Routes, Route } from 'react-router-dom'
import { useState, useMemo, useDeferredValue } from 'react'
import AppLayout from './layout/app-layout'
import AlgorithmPage from './pages/algorithm-page'
import { registry } from './registry'

export default function App() {
  const [dark, setDark] = useState(false)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(() => {
    if (!deferredQuery.trim()) return []
    const q = deferredQuery.toLowerCase()
    return registry.filter(a =>
      a.meta.title.includes(q) ||
      a.meta.id.includes(q) ||
      a.meta.category.includes(q)
    )
  }, [deferredQuery])

  return (
    <div className={dark ? 'dark' : ''}>
      <AppLayout dark={dark} onToggleDark={() => setDark(!dark)}>
        <Routes>
          <Route path="/" element={<HomePage query={query} setQuery={setQuery} filtered={filtered} />} />
          <Route path="/algorithm/:algoId" element={<AlgorithmPage />} />
        </Routes>
      </AppLayout>
    </div>
  )
}

function HomePage({ query, setQuery, filtered }: {
  query: string
  setQuery: (q: string) => void
  filtered: typeof registry
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-lg w-full">
        <h1 className="text-5xl font-light tracking-tight mb-4 text-gray-900 dark:text-white">
          Visual<span className="font-semibold">Algo</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
          信息竞赛算法可视化 &middot; 交互式学习平台
        </p>

        <div className="relative mb-8">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索算法（名称 / ID / 类别）..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl glass-strong text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-400/50
              dark:bg-gray-800/60 dark:text-gray-200 dark:placeholder:text-gray-500
              transition-all"
          />
        </div>

        {filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-2 text-left">
            {filtered.slice(0, 8).map(a => (
              <a
                key={a.meta.id}
                href={`/algorithm/${a.meta.id}`}
                className="px-4 py-2.5 rounded-xl glass-light hover:bg-white/50 transition-colors
                  dark:hover:bg-gray-700/50 dark:text-gray-200"
                onClick={e => { e.preventDefault(); window.location.href = `/algorithm/${a.meta.id}` }}
              >
                <span className="text-sm font-medium">{a.meta.title}</span>
                <span className="text-xs text-slate-400 dark:text-gray-500 ml-2">{a.meta.category}</span>
              </a>
            ))}
          </div>
        )}

        {query && filtered.length === 0 && (
          <p className="text-sm text-slate-400 mt-4">未找到匹配的算法</p>
        )}

        <p className="text-slate-400 dark:text-gray-500 text-sm mt-12">
          CSP &middot; NOIP &middot; NOI &middot; IOI 覆盖全部核心算法
        </p>
      </div>
    </div>
  )
}
