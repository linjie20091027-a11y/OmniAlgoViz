import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'radix-sort',
  title: '基数排序',
  category: 'sorting',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(d(n+k))', space: 'O(n+k)', worst: 'O(d(n+k))' },
  description: '按最低位（LSD）到最高位对每一位进行计数排序。O(d·(n+k))，d 为最大位数。稳定。',
}
export default meta
