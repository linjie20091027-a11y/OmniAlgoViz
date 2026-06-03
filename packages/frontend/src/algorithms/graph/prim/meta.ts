import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'prim',
  title: 'Prim 最小生成树',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 6, min: 3, max: 12 }],
  complexity: { time: 'O(ElogV)', space: 'O(V)' },
  description: '最小生成树算法。从任意节点开始，每次选择与当前树相连的最小权边加入。O(E log V)，贪心策略。',
}
export default meta
