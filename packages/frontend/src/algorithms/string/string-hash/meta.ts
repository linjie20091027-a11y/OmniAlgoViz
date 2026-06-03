import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'string-hash',
  title: '字符串哈希',
  category: 'string',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '字符串长度', type: 'number', default: 12, min: 5, max: 25, step: 1 },
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
}

export default meta
