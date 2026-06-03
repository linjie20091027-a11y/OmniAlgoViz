import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'dinic',
  title: 'Dinic 最大流',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 5,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 10 }],
  complexity: { time: 'O(V²E)', space: 'O(V+E)' },
}
export default meta
