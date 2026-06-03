import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'LCS',
  title: '最长公共子序列',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 3,
  params: [
    { key: 'size', label: '字符串长度', type: 'number', default: 8, min: 4, max: 15, step: 1 },
  ],
  complexity: { time: 'O(nm)', space: 'O(nm)' },
  description: 'dp[i][j] = 两字符串前 i,j 个字符的 LCS 长度。字符相等时 dp[i][j]=dp[i-1][j-1]+1，否则取 max(dp[i-1][j], dp[i][j-1])。',
}

export default meta
