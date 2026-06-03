import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'quick-mul',
  title: '快速乘（俄罗斯农民乘法）',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'a', label: '乘数 a', type: 'number', default: 13, min: 1, max: 100 },
    { key: 'b', label: '乘数 b', type: 'number', default: 7, min: 1, max: 100 },
  ],
  complexity: { time: 'O(log b)', space: 'O(1)' },
}
export default meta
