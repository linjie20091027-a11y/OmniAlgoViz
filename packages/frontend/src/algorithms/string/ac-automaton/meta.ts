import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'ac-automaton',
  title: 'AC自动机',
  category: 'string',
  visualizerType: 'bar',
  difficulty: 4,
  params: [
    { key: 'size', label: '模式串数量', type: 'number', default: 5, min: 2, max: 15, step: 1 },
  ],
  complexity: { time: 'O(n+m+z)', space: 'O(n·σ)' },
  description: 'Trie（字典树）上添加失败指针（fail links）构成自动机。将多模式匹配从 O(n·|Σ|) 优化到 O(n+m+z)。多字符串匹配利器。',
}

export default meta
