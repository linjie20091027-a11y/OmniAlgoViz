import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'spfa',
  title: 'SPFA 最短路',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O(VE)', space: 'O(V)' },
  description: 'Shortest Path Faster Algorithm。Bellman-Ford 的队列优化版，只松弛距离有变化的节点的出边。最坏 O(VE)，实际通常更快。',
}
export default meta
