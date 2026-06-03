import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'edit-distance',
  title: '编辑距离',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 3,
  params: [
    { key: 'size', label: '字符串长度', type: 'number', default: 6, min: 3, max: 12, step: 1 },
  ],
  complexity: { time: 'O(nm)', space: 'O(nm)' },
}

export default meta
