import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'hamiltonian',
  title: '哈密顿路径（回溯）',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 4,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 5, min: 3, max: 8 }],
  complexity: { time: 'O(V!)', space: 'O(V)' },
  description: '寻找过所有节点恰好一次的路径，NP 完全问题。使用回溯搜索，尝试每个未访问邻居，不成功则撤销并尝试别路。',
}
export default meta
