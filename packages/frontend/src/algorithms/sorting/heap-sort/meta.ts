import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'heap-sort',
  title: '堆排序',
  category: 'sorting',
  visualizerType: 'bar',
  difficulty: 3,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(1)', worst: 'O(n log n)' },
}
export default meta
