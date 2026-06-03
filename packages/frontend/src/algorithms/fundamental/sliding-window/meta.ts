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
}

export default meta
