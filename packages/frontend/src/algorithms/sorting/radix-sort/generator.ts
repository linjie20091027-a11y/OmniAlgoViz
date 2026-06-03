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

export default function* radixSort(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)
  const maxVal = Math.max(...arr)

  yield { objects: toBars(arr), highlights: [], codeLine: 1, description: `初始随机数组，最大值 = ${maxVal}` }

  let exp = 1
  while (Math.floor(maxVal / exp) > 0) {
    const digitName = exp === 1 ? '个位' : exp === 10 ? '十位' : '百位'
    yield {
      objects: toBars(arr),
      highlights: [],
      codeLine: 3,
      description: `第 ${Math.ceil(Math.log10(exp + 1))} 轮：按${digitName}排序（exp = ${exp}）`,
    }

    const count = new Array<number>(10).fill(0)
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10
      count[digit]++
    }

    yield {
      objects: toBars(arr),
      highlights: [],
      codeLine: 6,
      description: `完成${digitName}计数统计`,
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1]
    }

    const output = new Array<number>(n)
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10
      count[digit]--
      output[count[digit]] = arr[i]
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i]
    }

    yield {
      objects: toBars(arr),
      highlights: [],
      codeLine: 10,
      description: `${digitName}排序完成，数组按${digitName}有序`,
    }

    exp *= 10
  }

  const allSorted = arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.sorted))
  yield { objects: allSorted, highlights: [], codeLine: 13, description: '排序完成！' }
}
