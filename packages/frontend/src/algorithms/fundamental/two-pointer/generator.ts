import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

export default function* twoPointer(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = []
  let acc = 3
  for (let i = 0; i < n; i++) {
    arr.push(acc)
    acc += Math.floor(Math.random() * 8) + 1
  }

  const i1 = Math.floor(Math.random() * (n - 2))
  const i2 = i1 + Math.floor(Math.random() * (n - i1 - 1)) + 1
  const target = arr[i1] + arr[i2]

  yield {
    objects: arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.default)),
    highlights: [],
    codeLine: 1,
    description: `有序数组，求两数之和为 ${target}`,
  }

  let left = 0
  let right = n - 1

  while (left < right) {
    const sum = arr[left] + arr[right]

    yield {
      objects: arr.map((v, i) => {
        if (i === left) return mkBar(`bar-${i}`, v, i, COLORS.pointer)
        if (i === right) return mkBar(`bar-${i}`, v, i, COLORS.pointer)
        if (i < left || i > right) return mkBar(`bar-${i}`, v, i, COLORS.inactive)
        return mkBar(`bar-${i}`, v, i, COLORS.default)
      }),
      highlights: [`bar-${left}`, `bar-${right}`],
      codeLine: 4,
      description: `arr[${left}] = ${arr[left]}，arr[${right}] = ${arr[right]}，和 = ${sum}，目标 = ${target}`,
    }

    if (sum === target) {
      yield {
        objects: arr.map((v, i) => {
          if (i === left || i === right) return mkBar(`bar-${i}`, v, i, COLORS.sorted)
          if (i > left && i < right) return mkBar(`bar-${i}`, v, i, COLORS.selected)
          return mkBar(`bar-${i}`, v, i, COLORS.inactive)
        }),
        highlights: [`bar-${left}`, `bar-${right}`],
        codeLine: 6,
        description: `${arr[left]} + ${arr[right]} = ${target}，找到答案！`,
      }
      return
    } else if (sum < target) {
      left++
      yield {
        objects: arr.map((v, i) => {
          if (i < left) return mkBar(`bar-${i}`, v, i, COLORS.inactive)
          return mkBar(`bar-${i}`, v, i, COLORS.default)
        }),
        highlights: [],
        codeLine: 8,
        description: `${sum} < ${target}，和太小，左指针右移 → left = ${left}`,
      }
    } else {
      right--
      yield {
        objects: arr.map((v, i) => {
          if (i > right) return mkBar(`bar-${i}`, v, i, COLORS.inactive)
          return mkBar(`bar-${i}`, v, i, COLORS.default)
        }),
        highlights: [],
        codeLine: 10,
        description: `${sum} > ${target}，和太大，右指针左移 → right = ${right}`,
      }
    }
  }

  yield {
    objects: arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.inactive)),
    highlights: [],
    codeLine: 11,
    description: '未找到满足条件的两个数',
  }
}
