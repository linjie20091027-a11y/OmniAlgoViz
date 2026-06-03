import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'kruskal',
  title: 'Kruskal 最小生成树',
  category: 'graph',
  visualizerType: 'bar',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O(ElogE)', space: 'O(V)' },
}
export default meta
