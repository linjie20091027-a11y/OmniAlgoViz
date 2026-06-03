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
  description: '字符串匹配算法。先预处理模式串的"失配函数"（前缀函数）pi 数组，匹配失败时模式串跳过不必要的比较。O(n+m)，不是字符回退。',
}

export default meta
