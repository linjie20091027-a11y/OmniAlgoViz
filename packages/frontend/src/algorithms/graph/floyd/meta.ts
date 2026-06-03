import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'floyd',
  title: 'Floyd-Warshall 全源最短路',
  category: 'graph',
  visualizerType: 'bar',
  difficulty: 3,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 4, min: 3, max: 8 }],
  complexity: { time: 'O(V³)', space: 'O(V²)' },
}
export default meta
