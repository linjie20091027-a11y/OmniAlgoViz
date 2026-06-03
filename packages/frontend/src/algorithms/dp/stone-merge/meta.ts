import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'stone-merge',
  title: '石子合并',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 3,
  params: [
    { key: 'size', label: '石子堆数', type: 'number', default: 6, min: 3, max: 12, step: 1 },
  ],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
  description: '相邻石子合并，代价为合并后的堆值。dp[i][j] = min{dp[i][k] + dp[k+1][j]} + sum[i..j]。经典区间 DP。',
}

export default meta
