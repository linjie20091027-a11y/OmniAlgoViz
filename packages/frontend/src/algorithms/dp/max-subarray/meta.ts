import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'max-subarray',
  title: '最大子数组和',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 2,
  params: [
    { key: 'size', label: '数组长度', type: 'number', default: 10, min: 5, max: 25, step: 1 },
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  description: 'Kadane 算法。维护 current 和 max 两个变量。dp[i] = max(arr[i], dp[i-1] + arr[i])。O(n) 时间 O(1) 空间。',
}

export default meta
