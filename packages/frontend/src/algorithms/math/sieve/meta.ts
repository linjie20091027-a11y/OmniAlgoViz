import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'sieve',
  title: '埃氏筛法',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 2,
  params: [{ key: 'size', label: '规模', type: 'number', default: 30, min: 10, max: 60 }],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
}
export default meta
