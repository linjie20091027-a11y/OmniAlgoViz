import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'merge-sort',
  title: '归并排序',
  category: 'sorting',
  visualizerType: 'bar',
  difficulty: 3,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)', worst: 'O(n log n)' },
  stable: true,
}
export default meta
