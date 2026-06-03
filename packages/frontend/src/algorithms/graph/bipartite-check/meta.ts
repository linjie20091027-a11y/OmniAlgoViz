import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'bipartite-check',
  title: '二分图判定',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 2,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
  description: '用 BFS/DFS 给节点交替染色，若相邻节点同色则不是二分图。O(V+E)，用于最大匹配等前置判断。',
}
export default meta
