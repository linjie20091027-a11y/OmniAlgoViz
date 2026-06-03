import type { AlgorithmMeta } from '@vsa/shared'
const meta: AlgorithmMeta = {
  id: 'nim-game',
  title: 'Nim 博弈',
  category: 'math',
  visualizerType: 'bar',
  difficulty: 3,
  params: [{ key: 'size', label: '堆数', type: 'number', default: 4, min: 2, max: 8 }],
  complexity: { time: 'O(n)', space: 'O(n)' },
  description: '经典博弈论问题。n 堆石子，两人轮流取任意堆中任意数量。局面为必胜态当且仅当所有堆数量的异或(XOR)非 0。',
}
export default meta
