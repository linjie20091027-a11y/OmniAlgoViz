import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'quick-sort',
  title: '快速排序',
  category: 'sorting',
  visualizerType: 'bar',
  difficulty: 3,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(log n)', worst: 'O(n²)' },
}
export default meta
