import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'combination-num',
  title: '组合数（杨辉三角）',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 2,
  params: [{ key: 'size', label: '行数', type: 'number', default: 8, min: 3, max: 15 }],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
}
export default meta
