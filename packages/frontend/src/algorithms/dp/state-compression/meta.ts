import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'state-compression',
  title: '状压DP（TSP）',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 4,
  params: [
    { key: 'size', label: '城市数量', type: 'number', default: 4, min: 3, max: 6, step: 1 },
  ],
  complexity: { time: 'O(2^n·n²)', space: 'O(2^n·n)' },
}

export default meta
