import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'dfs',
  title: 'DFS 深度优先搜索',
  category: 'graph',
  visualizerType: 'bar',
  difficulty: 2,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 15 }],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
}
export default meta
