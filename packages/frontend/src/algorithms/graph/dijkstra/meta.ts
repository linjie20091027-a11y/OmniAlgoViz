import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'dijkstra',
  title: 'Dijkstra 最短路',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O((V+E)logV)', space: 'O(V)' },
}
export default meta
