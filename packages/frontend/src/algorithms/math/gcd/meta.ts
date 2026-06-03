import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'gcd',
  title: '欧几里得算法',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 1,
  params: [
    { key: 'a', label: '整数 a', type: 'number', default: 48, min: 1, max: 999 },
    { key: 'b', label: '整数 b', type: 'number', default: 18, min: 1, max: 999 },
  ],
  complexity: { time: 'O(log min(a,b))', space: 'O(1)' },
}
export default meta
