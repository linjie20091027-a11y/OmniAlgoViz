import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'nim-game',
  title: 'Nim 博弈',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 3,
  params: [{ key: 'size', label: '堆数', type: 'number', default: 4, min: 2, max: 8 }],
  complexity: { time: 'O(n)', space: 'O(n)' },
}
export default meta
