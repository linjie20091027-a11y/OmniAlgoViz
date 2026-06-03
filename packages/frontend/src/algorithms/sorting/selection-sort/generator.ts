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

export default function* selectionSort(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)

  yield { objects: toBars(arr), highlights: [], codeLine: 1, description: '初始随机数组' }

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    const posBars = toBars(arr)
    posBars[i].color = COLORS.pivot
    for (let k = 0; k < i; k++) posBars[k].color = COLORS.sorted
    yield {
      objects: posBars,
      highlights: [],
      codeLine: 3,
      description: `第 ${i + 1} 轮：在未排序部分中寻找最小值`,
    }

    for (let j = i + 1; j < n; j++) {
      yield {
        objects: toBars(arr, [`bar-${minIdx}`], [j]),
        highlights: [],
        codeLine: 5,
        description: `比较 arr[${j}]=${arr[j]} 与当前最小值 arr[${minIdx}]=${arr[minIdx]}`,
      }
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        yield {
          objects: toBars(arr, [`bar-${minIdx}`]),
          highlights: [],
          codeLine: 6,
          description: `更新最小值：arr[${minIdx}]=${arr[minIdx]} 成为新的最小值`,
        }
      }
    }

    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      yield {
        objects: toBars(arr, [`bar-${i}`, `bar-${minIdx}`]),
        highlights: [`bar-${i}`, `bar-${minIdx}`],
        codeLine: 8,
        description: `交换 arr[${i}] 和 arr[${minIdx}]（最小值归位）`,
      }
    }
  }

  const allSorted = arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.sorted))
  yield { objects: allSorted, highlights: [], codeLine: 11, description: '排序完成！' }
}
