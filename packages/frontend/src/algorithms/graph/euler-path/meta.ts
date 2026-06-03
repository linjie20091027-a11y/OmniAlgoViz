import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'euler-path',
  title: '欧拉路径（Hierholzer）',
  category: 'graph',
  visualizerType: 'bar',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 5, min: 3, max: 10 }],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
}
export default meta
