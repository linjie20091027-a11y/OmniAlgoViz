import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'coin-change',
  title: '零钱兑换',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 2,
  params: [
    { key: 'size', label: '目标金额', type: 'number', default: 12, min: 5, max: 30, step: 1 },
  ],
  complexity: { time: 'O(n·amount)', space: 'O(amount)' },
  description: 'dp[i] = 凑出金额 i 的最少硬币数。对每种面额 coin，dp[i] = min(dp[i], dp[i-coin] + 1)。完全背包变种。',
}

export default meta
