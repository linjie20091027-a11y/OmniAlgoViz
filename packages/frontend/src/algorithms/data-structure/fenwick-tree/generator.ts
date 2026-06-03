import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function toBars(tree: number[], n: number, highlights: string[] = [], focusIdx: number | null = null): BarObject[] {
  return tree.map((v, i) => {
    if (i === 0) return mkBar(`bit-${i}`, v, i, COLORS.inactive, '占位')
    let color = COLORS.default
    if (highlights.includes(`bit-${i}`)) color = COLORS.highlight
    if (focusIdx === i) color = COLORS.comparing
    const lowbit = i & -i
    const cover = `覆盖[${i - lowbit + 1},${i}]`
    return mkBar(`bit-${i}`, v, i, color, cover)
  })
}

export default function* fenwickTreeGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 20) + 1)
  const tree: number[] = new Array(n + 1).fill(0)

  yield {
    objects: toBars(tree, n),
    highlights: [],
    codeLine: 1,
    description: `初始化树状数组，大小 ${n}，原始数组：[${arr.join(', ')}]`,
  }

  for (let i = 0; i < n; i++) {
    let idx = i + 1
    while (idx <= n) {
      tree[idx] += arr[i]
      yield {
        objects: toBars(tree, n, [`bit-${idx}`]),
        highlights: [`bit-${idx}`],
        codeLine: 4,
        description: `将 arr[${i}] = ${arr[i]} 加到 BIT[${idx}]（覆盖范围 [${idx - (idx & -idx) + 1}, ${idx}]）`,
      }
      idx += idx & -idx
    }
  }

  yield {
    objects: toBars(tree, n).map((b, i) => ({ ...b, color: i > 0 ? COLORS.sorted : COLORS.inactive })),
    highlights: [],
    codeLine: 7,
    description: '建树完成',
  }

  const queryIdx = Math.floor(n / 2)
  let prefixSum = 0
  let qIdx = queryIdx
  const touched: number[] = []

  yield {
    objects: toBars(tree, n),
    highlights: [],
    codeLine: 9,
    description: `查询前缀和 prefixSum(${queryIdx}) —— 累加 BIT 中覆盖该区间的节点`,
  }

  while (qIdx > 0) {
    touched.push(qIdx)
    prefixSum += tree[qIdx]
    yield {
      objects: toBars(tree, n, touched.map(i => `bit-${i}`)),
      highlights: touched.map(i => `bit-${i}`),
      codeLine: 11,
      description: `累加 BIT[${qIdx}] = ${tree[qIdx]}，当前前缀和 = ${prefixSum}`,
    }
    qIdx -= qIdx & -qIdx
  }

  const verifySum = arr.slice(0, queryIdx).reduce((s, v) => s + v, 0)
  yield {
    objects: toBars(tree, n, touched.map(i => `bit-${i}`)),
    highlights: [],
    codeLine: 13,
    description: `前缀和 prefixSum(${queryIdx}) = ${prefixSum}，验证：arr[0..${queryIdx - 1}] 之和 = ${verifySum}`,
  }
}
