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
  description: '用哈希值来匹配字符串。滚动哈希 O(1) 计算下一个子串的哈希，哈希匹配后再逐字符验证 O(n+m) 平均。',
}

export default meta
