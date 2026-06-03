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
  description: '依次比较相邻元素，将较大的值往后"冒泡"。每轮确定一个最大元素的位置。稳定排序，适合小规模数据教学。',
  stable: true,
}

export default meta
