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

export default function* mergeSort(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)
  const tmp = new Array<number>(n)

  yield { objects: toBars(arr), highlights: [], codeLine: 1, description: '初始随机数组' }

  function* ms(l: number, r: number, depth: number): Generator<Scene> {
    if (l >= r) return
    const mid = Math.floor((l + r) / 2)

    const splitBars = toBars(arr)
    for (let i = l; i <= mid; i++) splitBars[i].color = COLORS.selected
    for (let i = mid + 1; i <= r; i++) splitBars[i].color = COLORS.pointer
    yield {
      objects: splitBars,
      highlights: [],
      codeLine: 4,
      description: `分割 [${l}, ${r}] → 左半 [${l}, ${mid}] (蓝) | 右半 [${mid + 1}, ${r}] (紫)`,
    }

    yield* ms(l, mid, depth + 1)
    yield* ms(mid + 1, r, depth + 1)

    let i = l
    let j = mid + 1
    let k = l

    while (i <= mid && j <= r) {
      yield {
        objects: toBars(arr, [], [i, j]),
        highlights: [],
        codeLine: 9,
        description: `合并比较 arr[${i}]=${arr[i]} ↔ arr[${j}]=${arr[j]}`,
      }
      if (arr[i] <= arr[j]) {
        tmp[k++] = arr[i++]
      } else {
        tmp[k++] = arr[j++]
      }
    }
    while (i <= mid) tmp[k++] = arr[i++]
    while (j <= r) tmp[k++] = arr[j++]

    for (let p = l; p <= r; p++) {
      arr[p] = tmp[p]
    }

    const mergedBars = toBars(arr)
    for (let p = l; p <= r; p++) mergedBars[p].color = COLORS.highlight
    yield {
      objects: mergedBars,
      highlights: [],
      codeLine: 14,
      description: `合并完成 [${l}, ${r}]，已有序`,
    }
  }

  yield* ms(0, n - 1, 0)

  const allSorted = arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.sorted))
  yield { objects: allSorted, highlights: [], codeLine: 17, description: '排序完成！' }
}
