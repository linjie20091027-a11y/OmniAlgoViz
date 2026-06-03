import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

function toBars(arr: number[], highlights: string[] = [], compareIdx: number[] = []): BarObject[] {
  return arr.map((v, i) => {
    let color = COLORS.default
    if (highlights.includes(`bar-${i}`)) color = COLORS.highlight
    if (compareIdx.includes(i)) color = COLORS.comparing
    return mkBar(`bar-${i}`, v, i, color)
  })
}

export default function* countingSort(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)
  const maxVal = Math.max(...arr)
  const count = new Array<number>(maxVal + 1).fill(0)
  const output = new Array<number>(n)

  yield { objects: toBars(arr), highlights: [], codeLine: 1, description: `初始随机数组，最大值 = ${maxVal}` }

  for (let i = 0; i < n; i++) {
    const v = arr[i]
    count[v]++
    yield {
      objects: toBars(arr, [], [i]),
      highlights: [],
      codeLine: 4,
      description: `计数 count[${v}]++ = ${count[v]}（统计 arr[${i}]=${v}）`,
    }
  }

  yield {
    objects: toBars(arr),
    highlights: [],
    codeLine: 6,
    description: `计数完成，开始计算前缀和`,
  }

  for (let i = 1; i <= maxVal; i++) {
    count[i] += count[i - 1]
  }
  yield {
    objects: toBars(arr),
    highlights: [],
    codeLine: 8,
    description: `前缀和计算完成，count 数组表示每个值的最终位置`,
  }

  yield {
    objects: toBars(arr),
    highlights: [],
    codeLine: 10,
    description: '从后往前遍历原数组，放置元素到输出数组',
  }

  for (let i = n - 1; i >= 0; i--) {
    const v = arr[i]
    count[v]--
    const pos = count[v]
    output[pos] = v

    const stepBars = output.map((val, idx) =>
      val > 0 ? mkBar(`bar-${idx}`, val, idx, idx <= pos ? COLORS.sorted : COLORS.inactive) : mkBar(`bar-${idx}`, 0, idx, COLORS.inactive)
    )
    for (let k = i; k < n; k++) {
      if (output[k] > 0) stepBars[k].color = stepBars[k].color
    }
    stepBars[pos].color = COLORS.highlight
    yield {
      objects: stepBars,
      highlights: [],
      codeLine: 12,
      description: `放置 arr[${i}]=${v} → output[${pos}]`,
    }
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i]
  }

  const allSorted = arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.sorted))
  yield { objects: allSorted, highlights: [], codeLine: 14, description: '排序完成！' }
}
