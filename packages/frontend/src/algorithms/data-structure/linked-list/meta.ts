import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'linked-list',
  title: '链表',
  category: 'data-structure',
  visualizerType: 'list',
  difficulty: 2,
  params: [{ key: 'size', label: '节点数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(1) / O(n)', space: 'O(n)' },
}
export default meta
