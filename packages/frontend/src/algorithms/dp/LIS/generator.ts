import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* lis(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 5)

  // 原始数组
  const initBars = arr.map((v, i) => mkBar(`arr-${i}`, v, i, COLORS.default, String(v)))
  yield {
    objects: initBars,
    highlights: [],
    codeLine: 1,
    description: `初始数组，长度 = ${n}，求最长严格上升子序列`,
  }

  const tails: number[] = []
  const dp: number[] = new Array(n).fill(1)
  const pred: (number | null)[] = new Array(n).fill(null)

  for (let i = 0; i < n; i++) {
    const x = arr[i]

    // 二分查找
    let lo = 0, hi = tails.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (tails[mid] < x) lo = mid + 1
      else hi = mid
    }
    const pos = lo

    // 展示二分查找过程
    if (tails.length > 0) {
      const tailsBars = tails.map((v, j) =>
        mkBar(`tail-${j}`, v, j, j === pos ? COLORS.highlight : COLORS.comparing, `tails[${j}]`)
      )
      yield {
        objects: tailsBars,
        highlights: pos < tails.length ? [`tail-${pos}`] : [],
        codeLine: 6,
        description: `元素 arr[${i}] = ${x} 的二分查找：插入位置 = ${pos}，tails = [${tails.join(', ')}]`,
      }
    } else {
      yield {
        objects: [],
        highlights: [],
        codeLine: 6,
        description: `tails 为空，arr[${i}] = ${x} 直接追加`,
      }
    }

    if (pos === tails.length) {
      tails.push(x)
    } else {
      tails[pos] = x
    }
    dp[i] = pos + 1
    if (pos > 0) pred[i] = i - 1 // 简化：存储前驱

    // 更新后的 tails
    const tailsAfter = tails.map((v, j) =>
      mkBar(`tail-${j}`, v, j, COLORS.default, `tails[${j}]=${v}`)
    )
    yield {
      objects: tailsAfter,
      highlights: [`tail-${pos}`],
      codeLine: 7,
      description: `更新 tails[${pos}] = ${x}，tails = [${tails.join(', ')}]`,
    }
  }

  const len = tails.length

  // 回溯构造 LIS
  const lisSeq: number[] = []
  let need = len
  for (let i = n - 1; i >= 0; i--) {
    if (dp[i] === need) {
      lisSeq.push(arr[i])
      need--
    }
  }
  lisSeq.reverse()

  // 展示原数组，高亮 LIS 元素
  const lisSet = new Set<number>()
  lisSeq.forEach((v, idx) => {
    // 找到对应位置
    for (let i = 0; i < n; i++) {
      if (arr[i] === v && !lisSet.has(i) && dp[i] === (idx + 1)) {
        lisSet.add(i)
        break
      }
    }
  })

  const resultBars = arr.map((v, i) => {
    const inLis = lisSet.has(i)
    return mkBar(
      `final-${i}`,
      v,
      i,
      inLis ? COLORS.sorted : COLORS.inactive,
      inLis ? `${v} ↗` : String(v)
    )
  })

  yield {
    objects: resultBars,
    highlights: [],
    codeLine: 8,
    description: `最长上升子序列（O(n log n)）：LIS = [${lisSeq.join(', ')}]，长度 = ${len}`,
  }
}
