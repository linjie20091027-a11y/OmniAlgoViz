import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'trie',
  title: '字典树',
  category: 'data-structure',
  visualizerType: 'tree',
  difficulty: 3,
  params: [{ key: 'size', label: '单词数', type: 'number', default: 5, min: 2, max: 10 }],
  complexity: { time: 'O(L)', space: 'O(ΣL)' },
  description: '用于高效存储和检索字符串集合的树形结构。每条边代表一个字符，从根到某节点的路径即代表一个前缀/单词。O(L) 查询。',
}
export default meta
