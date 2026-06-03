import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'minimum-notation',
  title: '最小表示法',
  category: 'string',
  visualizerType: 'bar',
  difficulty: 3,
  params: [
    { key: 'size', label: '字符串长度', type: 'number', default: 12, min: 4, max: 24, step: 1 },
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
}

export default meta
