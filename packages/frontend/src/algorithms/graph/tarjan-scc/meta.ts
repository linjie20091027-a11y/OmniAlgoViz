import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'tarjan-scc',
  title: 'Tarjan 强连通分量',
  category: 'graph',
  visualizerType: 'bar',
  difficulty: 4,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
}
export default meta
