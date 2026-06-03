import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'dijkstra',
  title: 'Dijkstra 最短路',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O((V+E)logV)', space: 'O(V)' },
  description: '单源最短路径算法。维护距离数组，每次选未处理的最短距离节点松弛其邻居。要求边权非负，O((V+E)log V)。贪心策略。',
}
export default meta
