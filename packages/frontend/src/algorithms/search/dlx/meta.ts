import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'dlx',
  title: 'Dancing Links',
  category: 'search',
  visualizerType: 'tree',
  difficulty: 5,
  params: [
    { key: 'size', label: '矩阵规模', type: 'number', default: 6, min: 3, max: 12, step: 1 },
  ],
  complexity: { time: '指数级最坏', space: 'O(n·m)' },
  description: '用十字双向链表高效实现精确覆盖问题的搜索。通过列覆盖/取消操作快速剪枝，是 Donald Knuth 的 Algorithm X 的优化实现。用于数独等。',
}

export default meta
