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
  description: '将字符串映射为大整数，前缀哈希后 O(1) 获取任意子串的哈希值。通常选用双哈希（两个不同基数/模数）防碰撞。',
}

export default meta
