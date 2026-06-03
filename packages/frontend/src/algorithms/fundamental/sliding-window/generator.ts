import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

export default function* slidingWindow(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)
  const k = Math.max(2, Math.floor(n / 4))

  yield {
    objects: arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.default)),
    highlights: [],
    codeLine: 1,
    description: `原始数组，窗口大小 k = ${k}`,
  }

  let windowSum = 0
  for (let i = 0; i < k; i++) {
    windowSum += arr[i]
  }

  yield {
    objects: arr.map((v, i) => {
      if (i < k) return mkBar(`bar-${i}`, v, i, COLORS.selected)
      return mkBar(`bar-${i}`, v, i, COLORS.inactive)
    }),
    highlights: [],
    codeLine: 3,
    description: `初始窗口 [0, ${k - 1}]，窗口和 = ${windowSum}`,
  }

  let maxSum = windowSum

  for (let i = k; i < n; i++) {
    windowSum = windowSum - arr[i - k] + arr[i]
    const isNewMax = windowSum > maxSum
    if (isNewMax) maxSum = windowSum

    yield {
      objects: arr.map((v, j) => {
        if (j >= i - k + 1 && j <= i) return mkBar(`bar-${j}`, v, j, COLORS.selected)
        if (j === i - k) return mkBar(`bar-${j}`, v, j, COLORS.swapping)
        if (j === i) return mkBar(`bar-${j}`, v, j, COLORS.highlight)
        return mkBar(`bar-${j}`, v, j, COLORS.inactive)
      }),
      highlights: [],
      codeLine: 6,
      description: isNewMax
        ? `移除 arr[${i - k}]=${arr[i - k]}，加入 arr[${i}]=${arr[i]}，窗口和 = ${windowSum}（新最大值！）`
        : `移除 arr[${i - k}]=${arr[i - k]}，加入 arr[${i}]=${arr[i]}，窗口和 = ${windowSum}`,
    }
  }

  yield {
    objects: arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.inactive)),
    highlights: [],
    codeLine: 8,
    description: `滑动完成！最大窗口和 = ${maxSum}`,
  }
}
