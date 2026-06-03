import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'queue',
  title: '队列',
  category: 'data-structure',
  visualizerType: 'list',
  difficulty: 1,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(1)', space: 'O(n)' },
  description: '在队尾 enqueue（入队），在队首 dequeue（出队）。常用于 BFS、任务调度等。',
}
export default meta
