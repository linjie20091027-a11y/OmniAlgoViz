import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'kruskal',
  title: 'Kruskal 最小生成树',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O(ElogE)', space: 'O(V)' },
  description: '最小生成树算法。将所有边按权重排序，用并查集依次加入不构成环的边。O(E log E)，贪心策略。',
}
export default meta
