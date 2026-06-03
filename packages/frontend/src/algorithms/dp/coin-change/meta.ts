import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'coin-change',
  title: '零钱兑换',
  category: 'dp',
  visualizerType: 'bar',
  difficulty: 2,
  params: [
    { key: 'size', label: '目标金额', type: 'number', default: 12, min: 5, max: 30, step: 1 },
  ],
  complexity: { time: 'O(n·amount)', space: 'O(amount)' },
}

export default meta
