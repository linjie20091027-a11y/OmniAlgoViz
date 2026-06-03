import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'discretization',
  title: '离散化',
  category: 'fundamental',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 30, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  description: '将大范围稀疏值映射到紧凑的连续整数。排序去重后，用二分查找将原始值映射为索引。常用于 BIT/线段树前缀处理。',
}

export default meta
