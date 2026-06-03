import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'catalan',
  title: '卡特兰数',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 3,
  params: [{ key: 'size', label: '规模', type: 'number', default: 10, min: 3, max: 20 }],
  complexity: { time: 'O(n²)', space: 'O(n)' },
  description: 'C[n] = Σ C[i]×C[n-1-i] = C(2n,n)/(n+1)。计数问题：合法括号序列、二叉树形态数、出栈序列数、凸多边形三角剖分数。',
}
export default meta
