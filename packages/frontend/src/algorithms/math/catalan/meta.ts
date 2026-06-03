import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'catalan',
  title: '卡特兰数',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 3,
  params: [{ key: 'size', label: '规模', type: 'number', default: 10, min: 3, max: 20 }],
  complexity: { time: 'O(n²)', space: 'O(n)' },
}
export default meta
