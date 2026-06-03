import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'priority-queue',
  title: '优先队列',
  category: 'data-structure',
  visualizerType: 'tree',
  difficulty: 2,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  description: '每次出队元素优先级最高/最低的队列。通常用二叉堆实现。插入/删除 O(log n)。用于 Dijkstra、Prim 等。',
}
export default meta
