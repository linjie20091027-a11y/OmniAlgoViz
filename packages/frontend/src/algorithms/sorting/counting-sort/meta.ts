import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'counting-sort',
  title: '计数排序',
  category: 'sorting',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n+k)', space: 'O(k)', worst: 'O(n+k)' },
  description: '统计每个值出现的次数，计算前缀和确定位置，逆序放置保证稳定性。适用于整数且值域较小的场景。',
  stable: true,
}
export default meta
