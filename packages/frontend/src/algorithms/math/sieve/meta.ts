import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'sieve',
  title: '埃氏筛法',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 2,
  params: [{ key: 'size', label: '规模', type: 'number', default: 30, min: 10, max: 60 }],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
  description: '求 [2, n] 所有素数。从 2 开始，将其倍数全部标记为非素数。优化：只需筛到 √n。O(n log log n)。欧拉筛可达到 O(n)。',
}
export default meta
