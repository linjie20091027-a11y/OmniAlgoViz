import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'disjoint-set',
  title: '并查集',
  category: 'data-structure',
  visualizerType: 'tree',
  difficulty: 2,
  params: [{ key: 'size', label: '元素数', type: 'number', default: 8, min: 3, max: 20 }],
  complexity: { time: 'O(α(n))', space: 'O(n)' },
  description: '高效管理不相交集合的合并与查询。find(x) 查找根节点 + 路径压缩，union(x,y) 按秩合并。接近 O(1)。',
}
export default meta
