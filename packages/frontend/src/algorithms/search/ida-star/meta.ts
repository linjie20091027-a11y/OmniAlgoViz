import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'ida-star',
  title: 'IDA*搜索',
  category: 'search',
  visualizerType: 'bar',
  difficulty: 4,
  params: [
    { key: 'size', label: '网格规模', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: '取决于启发函数', space: 'O(d)' },
}

export default meta
