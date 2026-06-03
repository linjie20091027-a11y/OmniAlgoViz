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

export default function* insertionSort(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)

  yield { objects: toBars(arr), highlights: [], codeLine: 1, description: '初始随机数组' }

  for (let i = 1; i < n; i++) {
    const key = arr[i]

    const keyBars = toBars(arr, [`bar-${i}`])
    keyBars[i].color = COLORS.pivot
    for (let k = 0; k < i; k++) keyBars[k].color = COLORS.selected
    yield {
      objects: keyBars,
      highlights: [],
      codeLine: 3,
      description: `取出 key = arr[${i}] = ${key}，与已排序部分比较`,
    }

    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      yield {
        objects: toBars(arr, [`bar-${j + 1}`], [j]),
        highlights: [`bar-${j + 1}`],
        codeLine: 6,
        description: `arr[${j}]=${arr[j]} > ${key}，右移 arr[${j}] → arr[${j + 1}]`,
      }
      arr[j + 1] = arr[j]
      j--
    }

    arr[j + 1] = key
    yield {
      objects: toBars(arr, [`bar-${j + 1}`]),
      highlights: [],
      codeLine: 8,
      description: `插入 key=${key} 到位置 arr[${j + 1}]`,
    }
  }

  const allSorted = arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.sorted))
  yield { objects: allSorted, highlights: [], codeLine: 10, description: '排序完成！' }
}
