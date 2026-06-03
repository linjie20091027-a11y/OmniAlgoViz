import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'segment-tree',
  title: '线段树',
  category: 'data-structure',
  visualizerType: 'tree',
  difficulty: 4,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 4, max: 16 }],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  description: '二叉树，每个节点维护一段区间。支持 O(log n) 的区间查询和区间修改。常用于维护区间和/最值/乘积等。',
}
export default meta
