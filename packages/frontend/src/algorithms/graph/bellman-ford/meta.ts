import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'bellman-ford',
  title: 'Bellman-Ford 最短路',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 5, min: 3, max: 10 }],
  complexity: { time: 'O(VE)', space: 'O(V)' },
}
export default meta
