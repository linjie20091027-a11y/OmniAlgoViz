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
  description: '选取基准值 pivot，将数组划分为小于/大于 pivot 的两部分，递归排序。平均 O(n log n)，最坏 O(n²)。非稳定。',
}
export default meta
