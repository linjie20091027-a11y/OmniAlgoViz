import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'point-in-polygon',
  title: '点在多边形内',
  category: 'geometry',
  visualizerType: 'point',
  difficulty: 2,
  params: [
    { key: 'size', label: '多边形边数', type: 'number', default: 6, min: 3, max: 15, step: 1 },
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
}

export default meta
