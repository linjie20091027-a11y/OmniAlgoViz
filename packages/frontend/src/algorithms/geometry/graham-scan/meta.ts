import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'graham-scan',
  title: 'Graham Scan凸包',
  category: 'geometry',
  visualizerType: 'point',
  difficulty: 3,
  params: [
    { key: 'size', label: '点数量', type: 'number', default: 15, min: 5, max: 40, step: 1 },
  ],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  description: '找到最左下角的点作为基准，按极角排序后依次入栈。用叉积判断是否形成非左转（弹出栈顶点）。O(n log n)。',
}

export default meta
