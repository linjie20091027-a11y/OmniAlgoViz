import { Routes, Route } from 'react-router-dom'
import AppLayout from './layout/app-layout'
import AlgorithmPage from './pages/algorithm-page'

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/algorithm/:algoId" element={<AlgorithmPage />} />
      </Routes>
    </AppLayout>
  )
}

function HomePage() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-light tracking-tight mb-4">
          Visual<span className="font-semibold">Algo</span>
        </h1>
        <p className="text-slate-500 text-lg">
          信息竞赛算法可视化 · 交互式学习平台
        </p>
        <p className="text-slate-400 text-sm mt-2">
          CSP · NOIP · NOI · IOI 覆盖全部核心算法
        </p>
      </div>
    </div>
  )
}
