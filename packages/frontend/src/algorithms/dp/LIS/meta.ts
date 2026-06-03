import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'LIS',
  title: '最长上升子序列',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 3,
  params: [
    { key: 'size', label: '数组长度', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  description: '解法一：dp[i] = 以 i 结尾的 LIS 长度 O(n²)。解法二：维护 tails 数组，用二分查找优化到 O(n log n)。',
}

export default meta
