import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'monotonic-stack',
  title: '单调栈',
  category: 'data-structure',
  visualizerType: 'list',
  difficulty: 3,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(n)', space: 'O(n)' },
  description: '维护栈内元素单调递增或递减。新元素入栈前弹出违反单调性的元素。常用于找下一个更大/更小元素，O(n)。',
}
export default meta
