import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'modular-inverse',
  title: '乘法逆元',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 3,
  params: [
    { key: 'a', label: '整数 a', type: 'number', default: 3, min: 1, max: 100 },
    { key: 'mod', label: '模数 p', type: 'number', default: 11, min: 2, max: 101 },
  ],
  complexity: { time: 'O(log mod)', space: 'O(1)' },
}
export default meta
