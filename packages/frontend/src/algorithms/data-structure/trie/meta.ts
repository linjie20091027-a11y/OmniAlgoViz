import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'trie',
  title: '字典树',
  category: 'data-structure',
  visualizerType: 'tree',
  difficulty: 3,
  params: [{ key: 'size', label: '单词数', type: 'number', default: 5, min: 2, max: 10 }],
  complexity: { time: 'O(L)', space: 'O(ΣL)' },
}
export default meta
