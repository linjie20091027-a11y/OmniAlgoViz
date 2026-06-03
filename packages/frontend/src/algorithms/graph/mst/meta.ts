import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'mst',
  title: '最小生成树综合比较',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O(ElogE)', space: 'O(V)' },
  description: '对比 Kruskal 和 Prim 两种最小生成树算法的执行过程与差异。Kruskal 基于边排序+并查集，Prim 基于节点扩展+优先队列。',
}
export default meta
