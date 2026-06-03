import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'bst',
  title: '二叉搜索树',
  category: 'data-structure',
  visualizerType: 'tree',
  difficulty: 3,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(log n) 平均', space: 'O(n)' },
  description: '左子树 < 根 < 右子树的二叉树。插入和查找平均 O(log n)。中序遍历得到有序序列。最坏退化为链表 O(n)。',
}
export default meta
