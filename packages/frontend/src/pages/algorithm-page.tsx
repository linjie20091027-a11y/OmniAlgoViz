import { useParams, Link } from 'react-router-dom'
import { registry } from '../registry'
import Player from '../engine/player'

export default function AlgorithmPage() {
  const { algoId } = useParams<{ algoId: string }>()
  const algorithm = registry.find(a => a.meta.id === algoId)

  if (!algorithm) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <p className="text-slate-400 text-lg">算法 "{algoId}" 未找到</p>
        <Link to="/" className="text-indigo-500 hover:underline text-sm">返回首页</Link>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <Player algorithm={algorithm} />
    </div>
  )
}
