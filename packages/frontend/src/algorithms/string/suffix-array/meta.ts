import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'suffix-array',
  title: '后缀数组',
  category: 'string',
  visualizerType: 'bar',
  difficulty: 4,
  params: [
    { key: 'size', label: '字符串长度', type: 'number', default: 10, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  description: '将字符串所有后缀按字典序排序后的索引数组。用倍增法（排序 rank[i] 和 rank[i+k]）做到 O(n log n)。配合 height 数组解决多数字符串问题。',
}

export default meta
