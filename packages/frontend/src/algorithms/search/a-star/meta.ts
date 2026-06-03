import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'a-star',
  title: 'A*搜索',
  category: 'search',
  visualizerType: 'tree',
  difficulty: 4,
  params: [
    { key: 'size', label: '网格规模', type: 'number', default: 8, min: 4, max: 20, step: 1 },
  ],
  complexity: { time: '取决于启发函数', space: 'O(V)' },
  description: '评估函数 f(n) = g(n) + h(n)。g 为起点到当前的实际代价，h 为当前到目标的预估代价（启发函数）。若 h 可采纳则保证找到最优解。',
}

export default meta
