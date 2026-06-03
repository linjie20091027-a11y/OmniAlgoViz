import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'bfs-search',
  title: 'BFS搜索',
  category: 'search',
  visualizerType: 'tree',
  difficulty: 2,
  params: [
    { key: 'size', label: '网格规模', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
  description: '宽度优先搜索——适用于无权图/网格的最短路径。逐层扩展确保首次到达目标即为最优解。队列 + visited 集合。',
}

export default meta
