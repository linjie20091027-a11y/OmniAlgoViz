import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'state-compression',
  title: '状压DP（TSP）',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 4,
  params: [
    { key: 'size', label: '城市数量', type: 'number', default: 4, min: 3, max: 6, step: 1 },
  ],
  complexity: { time: 'O(2^n·n²)', space: 'O(2^n·n)' },
  description: '用二进制位表示集合状态。dp[mask][i] = 已访问集合为 mask 时到节点 i 的最短路径。经典 TSP 问题。',
}

export default meta
