import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'hamiltonian',
  title: '哈密顿路径（回溯）',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 4,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 5, min: 3, max: 8 }],
  complexity: { time: 'O(V!)', space: 'O(V)' },
}
export default meta
