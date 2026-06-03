import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'hungarian',
  title: '匈牙利算法（二分图匹配）',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 4,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 4, min: 3, max: 8 }],
  complexity: { time: 'O(VE)', space: 'O(V)' },
  description: '求二分图最大匹配。从每个未匹配点出发找增广路，若能找到则匹配数+1。O(VE)。',
}
export default meta
