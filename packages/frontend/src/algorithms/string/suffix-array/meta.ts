import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'suffix-array',
  title: '后缀数组',
  category: 'string',
  visualizerType: 'bar',
  difficulty: 4,
  params: [
    { key: 'size', label: '字符串长度', type: 'number', default: 10, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
}

export default meta
