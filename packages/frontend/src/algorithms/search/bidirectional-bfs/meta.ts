import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'bidirectional-bfs',
  title: '双向BFS',
  category: 'search',
  visualizerType: 'tree',
  difficulty: 3,
  params: [
    { key: 'size', label: '网格规模', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: 'O(b^(d/2))', space: 'O(b^(d/2))' },
  description: '从起点和终点同时 BFS，两个搜索前沿相遇时的总深度仅为单向的一半 O(b^(d/2))，大幅加快。',
}

export default meta
