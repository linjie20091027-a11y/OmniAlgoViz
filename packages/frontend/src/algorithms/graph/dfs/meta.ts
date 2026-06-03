import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'dfs',
  title: 'DFS 深度优先搜索',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 2,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 15 }],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
  description: '深度优先搜索——沿一条路径走到尽头再回溯。可以用栈（迭代）或递归实现。O(V+E)，用于拓扑排序、连通分量、Tarjan等。',
}
export default meta
