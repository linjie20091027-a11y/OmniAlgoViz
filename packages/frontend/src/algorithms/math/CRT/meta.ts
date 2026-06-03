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
  description: '求解同余方程组 x ≡ a_i (mod m_i)，其中 m_i 两两互质。合并公式：x = Σ(a_i × M_i × inv(M_i, m_i)) mod M，M = Π m_i。',
}
export default meta
