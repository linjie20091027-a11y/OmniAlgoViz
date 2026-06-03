import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'fast-pow',
  title: '快速幂',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'base', label: '底数', type: 'number', default: 2, min: 2, max: 20 },
    { key: 'exp', label: '指数', type: 'number', default: 10, min: 1, max: 30 },
  ],
  complexity: { time: 'O(log n)', space: 'O(1)' },
}
export default meta
