import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

export default function* prefixSum(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1)
  const pf = new Array(n).fill(0)

  yield {
    objects: arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.default)),
    highlights: [],
    codeLine: 1,
    description: '原始数组',
  }

  pf[0] = arr[0]
  yield {
    objects: arr.map((v, i) =>
      i === 0
        ? mkBar(`bar-${i}`, v, i, COLORS.highlight)
        : mkBar(`bar-${i}`, v, i, COLORS.default),
    ),
    highlights: [`bar-0`],
    codeLine: 4,
    description: `前缀和：pf[0] = arr[0] = ${arr[0]}`,
  }

  for (let i = 1; i < n; i++) {
    pf[i] = pf[i - 1] + arr[i]
    yield {
      objects: pf.map((v, j) => {
        if (j < i) return mkBar(`bar-${j}`, v, j, COLORS.sorted)
        if (j === i) return mkBar(`bar-${j}`, v, j, COLORS.highlight)
        return mkBar(`bar-${j}`, arr[j], j, COLORS.inactive)
      }),
      highlights: [`bar-${i}`],
      codeLine: 6,
      description: `前缀和：pf[${i}] = pf[${i - 1}] + arr[${i}] = ${pf[i - 1]} + ${arr[i]} = ${pf[i]}`,
    }
  }

  yield {
    objects: pf.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.sorted)),
    highlights: [],
    codeLine: 7,
    description: '前缀和数组构建完成！任意区间和 O(1) 查询',
  }

  const l = Math.floor(Math.random() * (n - 2))
  const r = l + 2 + Math.floor(Math.random() * (n - l - 2))
  const rangeSum = l === 0 ? pf[r] : pf[r] - pf[l - 1]
  yield {
    objects: pf.map((v, i) => {
      if (i >= l && i <= r) return mkBar(`bar-${i}`, v, i, COLORS.highlight)
      if (i === r) return mkBar(`bar-${i}`, v, i, COLORS.sorted)
      return mkBar(`bar-${i}`, v, i, COLORS.sorted)
    }),
    highlights: [`bar-${l}`, `bar-${r}`],
    codeLine: 7,
    description: `区间查询示例：[${l}, ${r}] 的和 = pf[${r}] - pf[${l - 1 >= 0 ? l - 1 : '无'}] = ${rangeSum}`,
  }
}
