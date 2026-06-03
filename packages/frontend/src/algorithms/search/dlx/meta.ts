import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'dlx',
  title: 'Dancing Links',
  category: 'search',
  visualizerType: 'bar',
  difficulty: 5,
  params: [
    { key: 'size', label: '矩阵规模', type: 'number', default: 6, min: 3, max: 12, step: 1 },
  ],
  complexity: { time: '指数级最坏', space: 'O(n·m)' },
}

export default meta
