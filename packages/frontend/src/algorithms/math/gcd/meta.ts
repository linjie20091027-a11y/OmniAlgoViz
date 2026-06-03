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
  description: '辗转相除法求最大公约数。gcd(a, b) = gcd(b, a % b)，直到 b = 0 时返回 a。O(log n)，计算量极小。',
}
export default meta
