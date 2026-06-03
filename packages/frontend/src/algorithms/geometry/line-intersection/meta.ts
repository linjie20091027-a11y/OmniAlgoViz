import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'line-intersection',
  title: '线段相交',
  category: 'geometry',
  visualizerType: 'point',
  difficulty: 2,
  params: [],
  complexity: { time: 'O(1)', space: 'O(1)' },
  description: '用叉积判断线段是否相交——每条线段的两个端点分别在另一线段的两侧。O(1)，是计算几何基础操作。',
}

export default meta
