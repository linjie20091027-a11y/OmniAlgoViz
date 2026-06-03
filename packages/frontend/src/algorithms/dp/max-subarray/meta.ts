import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'max-subarray',
  title: '最大子数组和',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 2,
  params: [
    { key: 'size', label: '数组长度', type: 'number', default: 10, min: 5, max: 25, step: 1 },
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
}

export default meta
