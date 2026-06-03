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

export default function* bubbleSort(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)

  yield { objects: toBars(arr), highlights: [], codeLine: 1, description: '初始随机数组' }

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - 1 - i; j++) {
      yield {
        objects: toBars(arr, [], [j, j + 1]),
        highlights: [],
        codeLine: 4,
        description: `比较 arr[${j}]=${arr[j]} 和 arr[${j + 1}]=${arr[j + 1]}`,
      }

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true
        yield {
          objects: toBars(arr, [`bar-${j}`, `bar-${j + 1}`], []),
          highlights: [`bar-${j}`, `bar-${j + 1}`],
          codeLine: 5,
          description: `交换 arr[${j}] 和 arr[${j + 1}]`,
        }
      }
    }
    // 标记已排序
    const sortedBars = toBars(arr)
    for (let k = n - 1 - i; k < n; k++) {
      sortedBars[k].color = COLORS.sorted
    }
    yield {
      objects: sortedBars,
      highlights: [],
      codeLine: 3,
      description: `第 ${i + 1} 轮结束，最后 ${i + 1} 个元素已排序`,
    }

    if (!swapped) break
  }

  const allSorted = arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.sorted))
  yield {
    objects: allSorted,
    highlights: [],
    codeLine: 8,
    description: '排序完成！',
  }
}
