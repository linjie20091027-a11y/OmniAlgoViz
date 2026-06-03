import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'shell-sort',
  title: '希尔排序',
  category: 'sorting',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n log n) ~ O(n²)', space: 'O(1)', worst: 'O(n²)' },
  description: '插入排序的改进版，通过逐渐减小的"间隔 gap"分组进行插入排序，最后 gap=1 即为标准插入排序。',
}
export default meta
