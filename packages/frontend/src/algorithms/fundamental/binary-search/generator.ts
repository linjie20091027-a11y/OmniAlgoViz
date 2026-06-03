import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

export default function* binarySearch(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = []
  let acc = 5
  for (let i = 0; i < n; i++) {
    arr.push(acc)
    acc += Math.floor(Math.random() * 10) + 1
  }

  const targetIdx = Math.floor(Math.random() * n)
  const target = arr[targetIdx]

  yield {
    objects: arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.default)),
    highlights: [],
    codeLine: 1,
    description: `有序数组，目标值 target = ${target}`,
  }

  let left = 0
  let right = n - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    yield {
      objects: arr.map((v, i) => {
        if (i === mid) return mkBar(`bar-${i}`, v, i, COLORS.pivot)
        if (i === left && i !== mid) return mkBar(`bar-${i}`, v, i, COLORS.pointer)
        if (i === right && i !== mid) return mkBar(`bar-${i}`, v, i, COLORS.pointer)
        if (i >= left && i <= right) return mkBar(`bar-${i}`, v, i, COLORS.selected)
        return mkBar(`bar-${i}`, v, i, COLORS.inactive)
      }),
      highlights: [`bar-${mid}`],
      codeLine: 4,
      description: `left=${left}  right=${right}  mid=${mid}  arr[mid]=${arr[mid]}`,
    }

    if (arr[mid] === target) {
      yield {
        objects: arr.map((v, i) =>
          i === mid
            ? mkBar(`bar-${i}`, v, i, COLORS.sorted)
            : mkBar(`bar-${i}`, v, i, COLORS.inactive),
        ),
        highlights: [`bar-${mid}`],
        codeLine: 6,
        description: `arr[${mid}] = ${arr[mid]} == ${target}，找到目标！索引为 ${mid}`,
      }
      return
    } else if (arr[mid] < target) {
      left = mid + 1
      yield {
        objects: arr.map((v, i) => {
          if (i < left) return mkBar(`bar-${i}`, v, i, COLORS.inactive)
          if (i >= left && i <= right) return mkBar(`bar-${i}`, v, i, COLORS.selected)
          return mkBar(`bar-${i}`, v, i, COLORS.inactive)
        }),
        highlights: [],
        codeLine: 8,
        description: `arr[${mid}] = ${arr[mid]} < ${target}，目标在右侧，left = ${left}`,
      }
    } else {
      right = mid - 1
      yield {
        objects: arr.map((v, i) => {
          if (i < left) return mkBar(`bar-${i}`, v, i, COLORS.inactive)
          if (i >= left && i <= right) return mkBar(`bar-${i}`, v, i, COLORS.selected)
          return mkBar(`bar-${i}`, v, i, COLORS.inactive)
        }),
        highlights: [],
        codeLine: 10,
        description: `arr[${mid}] = ${arr[mid]} > ${target}，目标在左侧，right = ${right}`,
      }
    }
  }

  yield {
    objects: arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.inactive)),
    highlights: [],
    codeLine: 11,
    description: '未找到目标值',
  }
}
