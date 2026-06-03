import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'LCS',
  title: '最长公共子序列',
  category: 'dp',
  visualizerType: 'bar',
  difficulty: 3,
  params: [
    { key: 'size', label: '字符串长度', type: 'number', default: 8, min: 4, max: 15, step: 1 },
  ],
  complexity: { time: 'O(nm)', space: 'O(nm)' },
}

export default meta
