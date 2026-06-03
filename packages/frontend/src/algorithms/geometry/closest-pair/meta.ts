import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'closest-pair',
  title: '最近点对',
  category: 'geometry',
  visualizerType: 'point',
  difficulty: 4,
  params: [
    { key: 'size', label: '点数量', type: 'number', default: 12, min: 4, max: 30, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  description: '分治法求平面中最近的两个点。递归分割，合并时只检查中线两侧窄带内的点对。O(n log n)。',
}

export default meta
