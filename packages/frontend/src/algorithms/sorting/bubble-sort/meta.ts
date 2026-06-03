import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'bubble-sort',
  title: '冒泡排序',
  category: 'sorting',
  visualizerType: 'bar',
  difficulty: 1,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n²)', space: 'O(1)', worst: 'O(n²)' },
  stable: true,
}

export default meta
