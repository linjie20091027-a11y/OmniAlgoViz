import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'a-star',
  title: 'A*搜索',
  category: 'search',
  visualizerType: 'tree',
  difficulty: 4,
  params: [
    { key: 'size', label: '网格规模', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: '取决于启发函数', space: 'O(V)' },
}

export default meta
