import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'selection-sort',
  title: '选择排序',
  category: 'sorting',
  visualizerType: 'bar',
  difficulty: 1,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n²)', space: 'O(1)', worst: 'O(n²)' },
  description: '每次从未排序区选择最小的元素，放到已排序区的末尾。不稳定，无论数据如何都做 O(n²) 次比较。',
}
export default meta
