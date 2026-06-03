import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'CRT',
  title: '中国剩余定理',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 4,
  params: [
    { key: 'size', label: '同余式数量', type: 'number', default: 3, min: 2, max: 5 },
  ],
  complexity: { time: 'O(n log M)', space: 'O(n)' },
}
export default meta
