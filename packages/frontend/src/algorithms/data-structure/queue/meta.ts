import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'queue',
  title: '队列',
  category: 'data-structure',
  visualizerType: 'list',
  difficulty: 1,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(1)', space: 'O(n)' },
}
export default meta
