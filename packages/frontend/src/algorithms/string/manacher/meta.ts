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
  description: '线性时间求字符串的最长回文子串。核心在利用已求回文的对称性跳过大部分中心扩展，维护最右回文边界 O(n)。',
}

export default meta
