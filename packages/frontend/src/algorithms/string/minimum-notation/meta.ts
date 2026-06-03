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
  description: '求环形字符串的字典序最小表示。用双指针比较法，碰到不等的字符时跳跃跳过较大者 O(n)。',
}

export default meta
