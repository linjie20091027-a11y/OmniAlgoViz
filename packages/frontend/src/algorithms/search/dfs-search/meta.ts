import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'dfs-search',
  title: 'DFS搜索',
  category: 'search',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '网格规模', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
}

export default meta
