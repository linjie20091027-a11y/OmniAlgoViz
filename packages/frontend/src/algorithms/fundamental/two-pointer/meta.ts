import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'two-pointer',
  title: '双指针',
  category: 'fundamental',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 12, min: 5, max: 30, step: 1 },
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  description: '两个指针在数组上移动，常用于有序数组的两数之和问题。指针向中间收缩 O(n)。',
}

export default meta
