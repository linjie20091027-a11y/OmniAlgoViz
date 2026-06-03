import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'disjoint-set',
  title: '并查集',
  category: 'data-structure',
  visualizerType: 'bar',
  difficulty: 2,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(α(n))', space: 'O(n)' },
}
export default meta
