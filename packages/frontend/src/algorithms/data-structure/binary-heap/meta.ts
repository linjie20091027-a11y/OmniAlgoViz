import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'binary-heap',
  title: '二叉堆',
  category: 'data-structure',
  visualizerType: 'tree',
  difficulty: 3,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  description: '完全二叉树，父节点的值 ≤ 子节点的值（小根堆）。插入：加到最后后上浮。删除堆顶：取最后元素放顶后下沉。',
}
export default meta
