import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'fenwick-tree',
  title: '树状数组',
  category: 'data-structure',
  visualizerType: 'tree',
  difficulty: 3,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 4, max: 16 }],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  description: '利用 idx += idx & -idx 高效维护前缀和的树状结构。单点更新和前缀查询均为 O(log n)。',
}
export default meta
