import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'stone-merge',
  title: '石子合并',
  category: 'dp',
  visualizerType: 'grid',
  difficulty: 3,
  params: [
    { key: 'size', label: '石子堆数', type: 'number', default: 6, min: 3, max: 12, step: 1 },
  ],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
}

export default meta
