import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'dfs-search',
  title: 'DFS搜索',
  category: 'search',
  visualizerType: 'tree',
  difficulty: 2,
  params: [
    { key: 'size', label: '网格规模', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
  description: '深度优先搜索——适合回溯场景，当搜索到死胡同时自动返回上层继续尝试。递归实现简洁，适用走迷宫、排列组合等。',
}

export default meta
