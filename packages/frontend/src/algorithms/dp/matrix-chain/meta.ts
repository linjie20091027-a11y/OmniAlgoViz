import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'matrix-chain',
  title: '矩阵链乘',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 4,
  params: [
    { key: 'size', label: '矩阵个数', type: 'number', default: 5, min: 3, max: 10, step: 1 },
  ],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
  description: 'dp[i][j] = 第 i 到 j 个矩阵相乘的最小代价。dp[i][j] = min{dp[i][k] + dp[k+1][j] + dim[i-1]×dim[k]×dim[j]}。区间 DP。',
}

export default meta
