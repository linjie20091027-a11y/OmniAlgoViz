import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'rabin-karp',
  title: 'Rabin-Karp哈希匹配',
  category: 'string',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '文本长度', type: 'number', default: 12, min: 5, max: 30, step: 1 },
  ],
  complexity: { time: 'O(n+m)', space: 'O(1)' },
}

export default meta
