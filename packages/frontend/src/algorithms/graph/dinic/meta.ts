import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'dinic',
  title: 'Dinic 最大流',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 5,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 10 }],
  complexity: { time: 'O(V²E)', space: 'O(V+E)' },
  description: '用 BFS 构建层次图 + DFS 找阻塞流，反复增广直到无增广路。O(V²E)，是实用的最大流算法。',
}
export default meta
