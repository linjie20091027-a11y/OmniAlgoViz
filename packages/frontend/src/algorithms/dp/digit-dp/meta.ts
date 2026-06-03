import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'digit-dp',
  title: '数位DP',
  category: 'dp',
  visualizerType: 'bar',
  difficulty: 4,
  params: [
    { key: 'size', label: '数字位数', type: 'number', default: 4, min: 2, max: 8, step: 1 },
  ],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
}

export default meta
