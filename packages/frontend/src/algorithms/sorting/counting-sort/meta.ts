import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'counting-sort',
  title: '计数排序',
  category: 'sorting',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n+k)', space: 'O(k)', worst: 'O(n+k)' },
  stable: true,
}
export default meta
