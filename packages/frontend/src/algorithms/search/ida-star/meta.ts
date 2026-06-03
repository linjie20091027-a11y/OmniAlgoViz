import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'ida-star',
  title: 'IDA*搜索',
  category: 'search',
  visualizerType: 'tree',
  difficulty: 4,
  params: [
    { key: 'size', label: '网格规模', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: '取决于启发函数', space: 'O(d)' },
  description: 'Iterative Deepening A*。用迭代加深方式实现 A*——逐次增加 f 值阈值，在 DFS 框架中剪枝。节省 A* 的内存开销。',
}

export default meta
