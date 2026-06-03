import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'combination-num',
  title: '组合数（杨辉三角）',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 2,
  params: [{ key: 'size', label: '行数', type: 'number', default: 8, min: 3, max: 15 }],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
  description: 'C(n,k) = C(n-1,k-1) + C(n-1,k)。杨辉三角递推。常用于组合数学计算。可预处理阶乘和逆元做到 O(1) 查询。',
}
export default meta
