import { Routes, Route, Link } from 'react-router-dom'
import { useState, useMemo, useDeferredValue } from 'react'
import AppLayout from './layout/app-layout'
import AlgorithmPage from './pages/algorithm-page'
import { registry } from './registry'

const CATEGORY_ICONS: Record<string, string> = {
  'sorting':         '\u{1F4CA}',
  'data-structure':  '\u{1F333}',
  'fundamental':     '\u{1F9EE}',
  'graph':           '\u{1F578}',
  'dp':              '\u{1F4DD}',
  'math':            '\u{1F522}',
  'string':          '\u{1F4DD}',
  'search':          '\u{1F50D}',
  'geometry':        '\u{1F4D0}',
}

const CATEGORY_NAMES: Record<string, string> = {
  'sorting':         '排序 Sorting',
  'data-structure':  '数据结构 Data Structure',
  'fundamental':     '基础 Fundamentals',
  'graph':           '图论 Graph',
  'dp':              'DP 动态规划',
  'math':            '数学 Math',
  'string':          '字符串 String',
  'search':          '搜索 Search',
  'geometry':        '几何 Geometry',
}

export default function App() {
  const [dark, setDark] = useState(false)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(() => {
    if (!deferredQuery.trim()) return []
    const q = deferredQuery.toLowerCase()
    return registry.filter(a =>
      a.meta.title.toLowerCase().includes(q) ||
      a.meta.id.includes(q) ||
      a.meta.category.includes(q)
    )
  }, [deferredQuery])

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
    <div className={dark ? 'dark' : ''}>
      <AppLayout dark={dark} onToggleDark={() => setDark(!dark)}>
        <Routes>
          <Route path="/" element={
            <HomePage query={query} setQuery={setQuery} filtered={filtered} categories={categories} />
          } />
          <Route path="/algorithm/:algoId" element={<AlgorithmPage />} />
        </Routes>
      </AppLayout>
    </div>
  )
}

function HomePage({ query, setQuery, filtered, categories }: {
  query: string
  setQuery: (q: string) => void
  filtered: typeof registry
  categories: [string, typeof registry][]
}) {
  const isSearching = query.trim().length > 0

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* 标题 */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
            Visual<span className="font-semibold">Algo</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mt-2">
            CSP &middot; NOIP &middot; NOI &middot; IOI
          </p>
        </div>

        {/* 搜索框 */}
        <div className="relative mb-8">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索 82 个算法 / Search 82 algorithms..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl glass-elevated text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-400/50
              dark:text-gray-200 dark:placeholder:text-gray-500 transition-all"
          />
        </div>

        {/* 搜索结果 */}
        {isSearching && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8">
            {filtered.map(a => (
              <Link
                key={a.meta.id}
                to={`/algorithm/${a.meta.id}`}
                className="px-4 py-2.5 rounded-xl glass-light hover:bg-white/50 dark:hover:bg-gray-700/50
                  transition-colors block no-underline"
              >
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{a.meta.title}</div>
                <div className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{CATEGORY_NAMES[a.meta.category] || a.meta.category}</div>
              </Link>
            ))}
          </div>
        )}
        {isSearching && filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 mb-8">没有找到匹配的算法 / No matching algorithms</p>
        )}

        {/* 分类卡片 */}
        <div className="space-y-8">
          {categories.map(([cat, algos]) => (
            <section key={cat}>
              <h3 className="text-sm font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-1">
                {CATEGORY_ICONS[cat] || '\u{1F4E6}'} {CATEGORY_NAMES[cat] || cat}
                <span className="ml-2 text-xs font-normal">{algos.length} algorithms</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {algos.map(algo => (
                  <Link
                    key={algo.meta.id}
                    to={`/algorithm/${algo.meta.id}`}
                    className="px-4 py-2.5 rounded-xl glass-light hover:bg-white/50 dark:hover:bg-gray-700/50
                      transition-colors block no-underline group"
                  >
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {algo.meta.title}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
                      {algo.meta.complexity.time}
                      {' \u{2B50}'.repeat(algo.meta.difficulty)}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {!isSearching && (
          <p className="text-center text-xs text-slate-400 dark:text-gray-600 mt-12">
            82 algorithms &middot; 9 categories &middot; 5 visualization engines &middot; Python + C++
          </p>
        )}
      </div>
    </div>
  )
}
