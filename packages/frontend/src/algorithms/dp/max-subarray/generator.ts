import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* maxSubarray(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => {
    const v = Math.floor(Math.random() * 60) - 25
    return v === 0 ? 1 : v
  })

  // 原始数组（用绝对值显示负值宽度）
  const initBars = arr.map((v, i) =>
    mkBar(`arr-${i}`, Math.abs(v), i, v >= 0 ? COLORS.default : COLORS.swapping, String(v))
  )
  yield {
    objects: initBars,
    highlights: [],
    codeLine: 1,
    description: `初始数组：[${arr.join(', ')}]，包含正负数，使用 Kadane 算法求最大子数组和`,
  }

  let cur = arr[0]
  let best = arr[0]
  let curStart = 0
  let bestStart = 0
  let bestEnd = 0

  yield {
    objects: arr.map((v, i) => {
      let color = i === 0 ? COLORS.highlight : COLORS.inactive
      return mkBar(`step-${i}`, Math.abs(v), i, i === 0 ? COLORS.highlight : COLORS.default, i === 0 ? `cur=${cur}` : String(v))
    }),
    highlights: [],
    codeLine: 2,
    description: `初始化：cur[0] = ${cur}，best = ${best}`,
  }

  for (let i = 1; i < n; i++) {
    const prevCur = cur
    const prevStart = curStart

    if (cur + arr[i] > arr[i]) {
      cur = cur + arr[i]
    } else {
      cur = arr[i]
      curStart = i
    }

    if (cur > best) {
      best = cur
      bestStart = curStart
      bestEnd = i
    }

    const bars = arr.map((v, j) => {
      let color = COLORS.default
      if (j >= curStart && j <= i) color = COLORS.comparing
      if (j >= bestStart && j <= bestEnd) color = COLORS.highlight
      if (j === i) color = COLORS.selected
      if (v < 0 && !(j >= bestStart && j <= bestEnd)) color = COLORS.inactive
      return mkBar(
        `step-${j}`,
        Math.abs(v),
        j,
        color,
        j === i ? `cur=${cur}` : j >= bestStart && j <= bestEnd && j === bestStart ? `best=${best}` : String(v)
      )
    })

    const action = prevCur + arr[i] > arr[i]
      ? `延伸：cur = ${prevCur} + ${arr[i]} = ${cur}`
      : `重置：cur = ${arr[i]}`

    yield {
      objects: bars,
      highlights: [`step-${i}`],
      codeLine: 4,
      description: `i=${i} arr[${i}]=${arr[i]}：${action}，当前 best = ${best}，最佳区间 [${bestStart}, ${bestEnd}]`,
    }
  }

  // 最终结果
  const finalBars = arr.map((v, j) => {
    const inBest = j >= bestStart && j <= bestEnd
    return mkBar(
      `final-${j}`,
      Math.abs(v),
      j,
      inBest ? COLORS.sorted : COLORS.inactive,
      inBest ? String(v) : ''
    )
  })

  yield {
    objects: finalBars,
    highlights: [],
    codeLine: 5,
    description: `Kadane 算法完成！最大子数组和 = ${best}，区间 [${bestStart}, ${bestEnd}]，O(n) 时间复杂度`,
  }
}
