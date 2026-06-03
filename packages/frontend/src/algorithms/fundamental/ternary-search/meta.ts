import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'ternary-search',
  title: '三分查找',
  category: 'fundamental',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 15, min: 8, max: 40, step: 1 },
  ],
  complexity: { time: 'O(log n)', space: 'O(1)' },
}

export default meta
