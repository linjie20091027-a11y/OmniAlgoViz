import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'LIS',
  title: '最长上升子序列',
  category: 'dp',
  visualizerType: 'bar',
  difficulty: 3,
  params: [
    { key: 'size', label: '数组长度', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
}

export default meta
