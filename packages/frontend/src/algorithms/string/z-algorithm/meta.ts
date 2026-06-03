import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'z-algorithm',
  title: 'Z函数',
  category: 'string',
  visualizerType: 'bar',
  difficulty: 3,
  params: [
    { key: 'size', label: '字符串长度', type: 'number', default: 15, min: 5, max: 30, step: 1 },
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  description: 'Z[i] = s[0:] 与 s[i:] 的最长公共前缀长度。利用已匹配段的信息高效计算，O(n)。用于模式匹配（将模式+原文用分隔符拼接）。',
}

export default meta
