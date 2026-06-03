import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'sliding-window',
  title: '滑动窗口',
  category: 'fundamental',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 16, min: 6, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n)', space: 'O(1)' },
  description: '在数组上维护一个固定大小的窗口，通过右移窗口更新窗口内的统计值。O(n) 解决子串/子数组问题。',
}

export default meta
