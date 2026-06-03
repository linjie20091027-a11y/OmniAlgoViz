import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'knapsack-01',
  title: '01背包问题',
  category: 'dp',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '物品数量', type: 'number', default: 6, min: 3, max: 12, step: 1 },
  ],
  complexity: { time: 'O(nW)', space: 'O(nW)' },
}

export default meta
