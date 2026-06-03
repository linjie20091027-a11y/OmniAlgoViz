import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'hungarian',
  title: '匈牙利算法（二分图匹配）',
  category: 'graph',
  visualizerType: 'bar',
  difficulty: 4,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 4, min: 3, max: 8 }],
  complexity: { time: 'O(VE)', space: 'O(V)' },
}
export default meta
