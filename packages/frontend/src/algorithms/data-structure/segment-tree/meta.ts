import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'segment-tree',
  title: '线段树',
  category: 'data-structure',
  visualizerType: 'bar',
  difficulty: 4,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 4, max: 16 }],
  complexity: { time: 'O(log n)', space: 'O(n)' },
}
export default meta
