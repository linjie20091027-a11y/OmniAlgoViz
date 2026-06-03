import type { AlgorithmMeta } from '@vsa/shared'

const meta: AlgorithmMeta = {
  id: 'prefix-sum',
  title: '前缀和',
  category: 'fundamental',
  visualizerType: 'bar',
  difficulty: 1,
  params: [
    { key: 'size', label: '数据量', type: 'number', default: 10, min: 5, max: 30, step: 1 },
  ],
  complexity: { time: 'O(n)', space: 'O(n)' },
  description: '预处理数组前 k 个元素的和。区间 [l,r] 的和 = prefix[r] - prefix[l-1]。O(1) 查询，O(n) 预处理。',
}

export default meta
