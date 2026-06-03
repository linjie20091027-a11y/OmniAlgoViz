import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'euler-path',
  title: '欧拉路径（Hierholzer）',
  category: 'graph',
  visualizerType: 'graph',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 5, min: 3, max: 10 }],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
  description: '一笔画问题。统计节点度数，奇数度节点数决定欧拉路径是否存在。用 Hierholzer 算法构造路径（DFS + 回溯记录）。',
}
export default meta
