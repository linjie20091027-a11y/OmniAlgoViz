import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'stack',
  title: '栈',
  category: 'data-structure',
  visualizerType: 'list',
  difficulty: 1,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(1)', space: 'O(n)' },
  description: '后进先出（LIFO）的线性结构。只允许在栈顶进行 push（入栈）和 pop（出栈）操作。常用于括号匹配、表达式求值、DFS 等。',
}
export default meta
