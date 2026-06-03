import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'knapsack-01',
  title: '01背包问题',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 2,
  params: [
    { key: 'size', label: '物品数量', type: 'number', default: 6, min: 3, max: 12, step: 1 },
  ],
  complexity: { time: 'O(nW)', space: 'O(nW)' },
  description: '经典 DP。dp[i][w] = 前 i 件物品在容量 w 下的最大价值。每件物品选或不选。O(nW)，可用滚动数组优化空间。',
}

export default meta
