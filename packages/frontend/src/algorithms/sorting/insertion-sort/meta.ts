import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'insertion-sort',
  title: '插入排序',
  category: 'sorting',
  visualizerType: 'bar',
  difficulty: 1,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n²)', space: 'O(1)', worst: 'O(n²)' },
  description: '将未排序元素逐一插入到已排序部分的正确位置。对近乎有序的数据效率极高，稳定。',
  stable: true,
}
export default meta
