import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'convex-hull',
  title: 'Andrew凸包',
  category: 'geometry',
  visualizerType: 'point',
  difficulty: 3,
  params: [
    { key: 'size', label: '点数量', type: 'number', default: 15, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  description: '求平面点集的凸包。先按 x 坐标排序，分别构建上凸壳和下凸壳。用叉积判断三点是否构成"右转"。O(n log n)。',
}

export default meta
