import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'kmp',
  title: 'KMP字符串匹配',
  category: 'string',
  visualizerType: 'bar',
  difficulty: 3,
  params: [
    { key: 'size', label: '文本长度', type: 'number', default: 12, min: 5, max: 30, step: 1 },
  ],
  complexity: { time: 'O(n+m)', space: 'O(m)' },
}

export default meta
