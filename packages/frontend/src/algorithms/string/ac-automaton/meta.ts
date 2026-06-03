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
}

export default meta
