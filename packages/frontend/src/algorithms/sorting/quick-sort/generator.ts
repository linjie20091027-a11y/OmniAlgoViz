import type { AlgorithmModule, Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

function toBars(arr: number[], hiIdx: number[] = [], swIdx: string[] = [], sortedAfter: number = 0): BarObject[] {
  return arr.map((v, i) => {
    let color = COLORS.default
    if (hiIdx.includes(i)) color = COLORS.comparing
    if (swIdx.includes(`bar-${i}`)) color = COLORS.swapping
    if (i >= sortedAfter) color = COLORS.sorted
    return mkBar(`bar-${i}`, v, i, color)
  })
}

export default function* quickSort(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)

  yield { objects: toBars(arr), highlights: [], codeLine: 1, description: '初始随机数组' }

  function* qs(lo: number, hi: number, lineBase: number): Generator<Scene> {
    if (lo >= hi) return
    const pivot = arr[hi]
    yield {
      objects: toBars(arr, [hi]),
      highlights: [],
      codeLine: lineBase + 1,
      description: `选择基准 pivot = arr[${hi}] = ${pivot}`,
    }

    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      yield {
        objects: toBars(arr, [j, hi]),
        highlights: [],
        codeLine: lineBase + 3,
        description: `比较 arr[${j}]=${arr[j]} 与基准 ${pivot}`,
      }
      if (arr[j] <= pivot) {
        i++
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]]
          yield {
            objects: toBars(arr, [], [`bar-${i}`, `bar-${j}`]),
            highlights: [`bar-${i}`, `bar-${j}`],
            codeLine: lineBase + 5,
            description: `交换 arr[${i}] 和 arr[${j}]`,
          }
        }
      }
    }
    i++
    ;[arr[i], arr[hi]] = [arr[hi], arr[i]]
    yield {
      objects: toBars(arr, [], [`bar-${i}`, `bar-${hi}`]),
      highlights: [],
      codeLine: lineBase + 7,
      description: `基准归位到 arr[${i}]`,
    }
    yield* qs(lo, i - 1, lineBase)
    yield* qs(i + 1, hi, lineBase)
  }

  yield* qs(0, n - 1, 2)

  const sorted = arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.sorted))
  yield { objects: sorted, highlights: [], codeLine: 10, description: '排序完成！' }
}
