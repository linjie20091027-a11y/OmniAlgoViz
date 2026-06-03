import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'hash-table',
  title: '哈希表',
  category: 'data-structure',
  visualizerType: 'list',
  difficulty: 2,
  params: [{ key: 'size', label: '桶数量', type: 'number', default: 7, min: 3, max: 15 }],
  complexity: { time: 'O(1) 平均', space: 'O(n)' },
  description: '通过哈希函数将键映射到桶中，冲突时使用链地址法或开放寻址法。查找/插入/删除 O(1) 平均。',
}
export default meta
