import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'manacher',
  title: 'Manacher回文',
  category: 'string',
  visualizerType: 'bar',
  difficulty: 4,
  params: [
    { key: 'size', label: '字符串长度', type: 'number', default: 15, min: 5, max: 30, step: 1 },
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
}

export default meta
