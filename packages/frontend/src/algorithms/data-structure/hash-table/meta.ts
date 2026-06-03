import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'hash-table',
  title: '哈希表',
  category: 'data-structure',
  visualizerType: 'list',
  difficulty: 2,
  params: [{ key: 'size', label: '桶数量', type: 'number', default: 7, min: 3, max: 15 }],
  complexity: { time: 'O(1) 平均', space: 'O(n)' },
}
export default meta
