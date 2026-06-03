import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'prime-test',
  title: 'Miller-Rabin 素性测试',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 4,
  params: [
    { key: 'n', label: '待测数 n', type: 'number', default: 97, min: 3, max: 999 },
    { key: 'size', label: '测试轮数 k', type: 'number', default: 3, min: 1, max: 10 },
  ],
  complexity: { time: 'O(k log³ n)', space: 'O(1)' },
  description: '概率素性测试。将 n-1 分解为 d×2^s，随机选基 a 检验 a^d mod n 和 a^(d×2^r) mod n。k 轮后错误率 < 1/4^k。',
}
export default meta
