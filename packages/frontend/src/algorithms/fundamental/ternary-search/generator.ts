import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

export default function* ternarySearch(params: { size: number }): Generator<Scene> {
  const n = params.size
  const peak = Math.floor(n * 0.35) + Math.floor(Math.random() * n * 0.3)
  const arr: number[] = []
  for (let i = 0; i < n; i++) {
    if (i <= peak) {
      arr.push(i * 4 + Math.floor(Math.random() * 3) + 1)
    } else {
      arr.push((n - i) * 4 + Math.floor(Math.random() * 3) - 1)
    }
  }

  yield {
    objects: arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.default)),
    highlights: [],
    codeLine: 1,
    description: '单峰数组（先递增后递减），三分查找峰值',
  }

  let left = 0
  let right = n - 1

  while (right - left > 2) {
    const third = Math.floor((right - left) / 3)
    const mid1 = left + third
    const mid2 = right - third

    yield {
      objects: arr.map((v, i) => {
        if (i === mid1) return mkBar(`bar-${i}`, v, i, COLORS.pivot)
        if (i === mid2) return mkBar(`bar-${i}`, v, i, COLORS.comparing)
        if (i === left) return mkBar(`bar-${i}`, v, i, COLORS.pointer)
        if (i === right) return mkBar(`bar-${i}`, v, i, COLORS.pointer)
        if (i >= left && i <= right) return mkBar(`bar-${i}`, v, i, COLORS.selected)
        return mkBar(`bar-${i}`, v, i, COLORS.inactive)
      }),
      highlights: [`bar-${mid1}`, `bar-${mid2}`],
      codeLine: 6,
      description: `mid1 = ${mid1}（值${arr[mid1]}），mid2 = ${mid2}（值${arr[mid2]}）`,
    }

    if (arr[mid1] < arr[mid2]) {
      left = mid1 + 1
      yield {
        objects: arr.map((v, i) => {
          if (i < left) return mkBar(`bar-${i}`, v, i, COLORS.inactive)
          if (i >= left && i <= right) return mkBar(`bar-${i}`, v, i, COLORS.selected)
          return mkBar(`bar-${i}`, v, i, COLORS.inactive)
        }),
        highlights: [],
        codeLine: 7,
        description: `arr[mid1] < arr[mid2]，峰值在右侧，left → ${left}`,
      }
    } else {
      right = mid2 - 1
      yield {
        objects: arr.map((v, i) => {
          if (i < left) return mkBar(`bar-${i}`, v, i, COLORS.inactive)
          if (i >= left && i <= right) return mkBar(`bar-${i}`, v, i, COLORS.selected)
          return mkBar(`bar-${i}`, v, i, COLORS.inactive)
        }),
        highlights: [],
        codeLine: 9,
        description: `arr[mid1] >= arr[mid2]，峰值在左侧，right → ${right}`,
      }
    }
  }

  let bestIdx = left
  for (let i = left + 1; i <= right; i++) {
    if (arr[i] > arr[bestIdx]) bestIdx = i
  }

  yield {
    objects: arr.map((v, i) => {
      if (i === bestIdx) return mkBar(`bar-${i}`, v, i, COLORS.sorted)
      if (i >= left && i <= right) return mkBar(`bar-${i}`, v, i, COLORS.selected)
      return mkBar(`bar-${i}`, v, i, COLORS.inactive)
    }),
    highlights: [`bar-${bestIdx}`],
    codeLine: 10,
    description: `找到峰值！arr[${bestIdx}] = ${arr[bestIdx]}`,
  }
}
