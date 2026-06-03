import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'convex-hull',
  title: 'Andrew凸包',
  category: 'geometry',
  visualizerType: 'point',
  difficulty: 3,
  params: [
    { key: 'size', label: '点数量', type: 'number', default: 15, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
}

export default meta
