import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'prim',
  title: 'Prim 最小生成树',
  category: 'graph',
  visualizerType: 'bar',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O(ElogV)', space: 'O(V)' },
}
export default meta
