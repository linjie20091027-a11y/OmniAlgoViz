import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'digit-dp',
  title: '数位DP',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 4,
  params: [
    { key: 'size', label: '数字位数', type: 'number', default: 4, min: 2, max: 8, step: 1 },
  ],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
  description: '统计 [0, n] 中满足某条件的数字个数。DFS 按位枚举，记忆化搜索状态(位置, 是否受限, 是否开始计数等)。',
}

export default meta
