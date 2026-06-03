import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'topological-sort',
  title: '拓扑排序',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 2,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
  description: '对有向无环图(DAG)的节点按先后依赖关系排序。维护入度数组，将入度为 0 的节点依次入队。O(V+E)。',
}
export default meta
