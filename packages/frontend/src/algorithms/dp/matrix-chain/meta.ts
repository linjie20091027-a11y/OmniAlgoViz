import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'matrix-chain',
  title: '矩阵链乘',
  category: 'dp',
  visualizerType: 'bar',
  difficulty: 4,
  params: [
    { key: 'size', label: '矩阵个数', type: 'number', default: 5, min: 3, max: 10, step: 1 },
  ],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
}

export default meta
