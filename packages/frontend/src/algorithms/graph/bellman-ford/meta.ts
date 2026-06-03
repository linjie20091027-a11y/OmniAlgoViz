import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'bellman-ford',
  title: 'Bellman-Ford 最短路',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 5, min: 3, max: 10 }],
  complexity: { time: 'O(VE)', space: 'O(V)' },
  description: '单源最短路径。对每条边松弛 V-1 轮，可处理负权边并检测负环。O(VE)，比 Dijkstra 慢但更通用。',
}
export default meta
