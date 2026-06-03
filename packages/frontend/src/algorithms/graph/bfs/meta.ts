import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'bfs',
  title: 'BFS 广度优先搜索',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 2,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 15 }],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
  description: '广度优先搜索——从起点出发，按层遍历所有邻居。使用队列 FIFO 保证"先被发现的先处理"。O(V+E)，适合找无权图最短路径。',
}
export default meta
