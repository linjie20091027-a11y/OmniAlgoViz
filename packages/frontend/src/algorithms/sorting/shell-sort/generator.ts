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

export default function* shellSort(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)

  yield { objects: toBars(arr), highlights: [], codeLine: 1, description: '初始随机数组' }

  let gap = Math.floor(n / 2)
  while (gap > 0) {
    yield {
      objects: toBars(arr),
      highlights: [],
      codeLine: 3,
      description: `当前间隔 gap = ${gap}`,
    }

    for (let i = gap; i < n; i++) {
      const temp = arr[i]
      const tempBars = toBars(arr)
      tempBars[i].color = COLORS.pivot
      yield {
        objects: tempBars,
        highlights: [],
        codeLine: 5,
        description: `取出 arr[${i}]=${temp}，在 gap=${gap} 的分组中比较`,
      }

      let j = i
      while (j >= gap && arr[j - gap] > temp) {
        yield {
          objects: toBars(arr, [], [j, j - gap]),
          highlights: [],
          codeLine: 7,
          description: `比较 arr[${j - gap}]=${arr[j - gap]} > ${temp}，右移`,
        }
        arr[j] = arr[j - gap]
        j -= gap
        yield {
          objects: toBars(arr, [`bar-${j + gap}`]),
          highlights: [],
          codeLine: 7,
          description: `arr[${j - gap}] 右移到 arr[${j}]`,
        }
      }

      arr[j] = temp
      yield {
        objects: toBars(arr, [`bar-${j}`]),
        highlights: [],
        codeLine: 9,
        description: `插入 temp=${temp} 到 arr[${j}]`,
      }
    }

    gap = Math.floor(gap / 2)
  }

  const allSorted = arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.sorted))
  yield { objects: allSorted, highlights: [], codeLine: 12, description: '排序完成！' }
}
