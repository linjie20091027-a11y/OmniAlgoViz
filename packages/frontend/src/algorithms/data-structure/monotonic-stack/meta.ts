import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'monotonic-stack',
  title: '单调栈',
  category: 'data-structure',
  visualizerType: 'bar',
  difficulty: 3,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(n)', space: 'O(n)' },
}
export default meta
