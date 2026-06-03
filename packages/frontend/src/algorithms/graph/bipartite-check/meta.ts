import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'bipartite-check',
  title: '二分图判定',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 2,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
}
export default meta
