import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'bidirectional-bfs',
  title: '双向BFS',
  category: 'search',
  visualizerType: 'bar',
  difficulty: 3,
  params: [
    { key: 'size', label: '网格规模', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: 'O(b^(d/2))', space: 'O(b^(d/2))' },
}

export default meta
