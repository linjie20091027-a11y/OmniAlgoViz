import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'linked-list',
  title: '链表',
  category: 'data-structure',
  visualizerType: 'list',
  difficulty: 2,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(1) / O(n)', space: 'O(n)' },
  description: '通过指针串联节点的线性结构。每个节点包含数据和指向下一节点的引用。插入/删除 O(1)，随机访问 O(n)。',
}
export default meta
