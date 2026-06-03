import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'binary-search',
  title: '二分查找',
  category: 'fundamental',
  visualizerType: 'bar',
  difficulty: 1,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 15, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(log n)', space: 'O(1)' },
  description: '在有序数组中，每次取中间元素比较，将搜索范围缩小一半。O(log n)。要求数组有序。',
}

export default meta
