import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'bst',
  title: '二叉搜索树',
  category: 'data-structure',
  visualizerType: 'bar',
  difficulty: 3,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(log n) 平均', space: 'O(n)' },
}
export default meta
