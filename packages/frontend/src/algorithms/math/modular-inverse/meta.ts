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
  description: 'a 在模 m 下的逆元 x 满足 a×x ≡ 1 (mod m)。当 m 为素数时，由费马小定理 x = a^(m-2) mod m，用快速幂计算。',
}
export default meta
