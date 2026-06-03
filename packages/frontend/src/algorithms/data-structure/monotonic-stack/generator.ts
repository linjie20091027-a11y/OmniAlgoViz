import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

function toBars(arr: number[], highlights: string[] = [], compareIdx: number[] = [], result: (number | null)[] = []): BarObject[] {
  return arr.map((v, i) => {
    let color = COLORS.default
    if (highlights.includes(`bar-${i}`)) color = COLORS.highlight
    if (compareIdx.includes(i)) color = COLORS.comparing
    if (result[i] !== undefined && result[i] !== null) color = COLORS.sorted
    return mkBar(`bar-${i}`, v, i, color)
  })
}

export default function* monotonicStack(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)

  yield {
    objects: toBars(arr),
    highlights: [],
    codeLine: 1,
    description: `初始数组，求每个元素的下一个更大元素`,
  }

  const stack: number[] = []
  const result: (number | null)[] = new Array(n).fill(null)

  for (let i = 0; i < n; i++) {
    yield {
      objects: toBars(arr, [], [i]),
      highlights: [],
      codeLine: 4,
      description: `遍历到 arr[${i}] = ${arr[i]}，检查栈顶元素`,
    }

    while (stack.length > 0 && arr[stack[stack.length - 1]] < arr[i]) {
      const popped = stack.pop()!
      result[popped] = arr[i]

      yield {
        objects: toBars(arr, [`bar-${popped}`], [i], result),
        highlights: [`bar-${popped}`],
        codeLine: 6,
        description: `栈顶 arr[${popped}] = ${arr[popped]} 小于当前 ${arr[i]}，弹出并记录结果 = ${arr[i]}`,
      }
    }

    stack.push(i)
    const stackHighlights = stack.map(j => `bar-${j}`)
    yield {
      objects: toBars(arr, stackHighlights, [i]),
      highlights: [],
      codeLine: 7,
      description: `将 arr[${i}] = ${arr[i]} 入栈，栈内索引：[${stack.join(', ')}]（单调递减栈）`,
    }
  }

  while (stack.length > 0) {
    const popped = stack.pop()!
    result[popped] = null
    yield {
      objects: toBars(arr, [`bar-${popped}`], [], result),
      highlights: [`bar-${popped}`],
      codeLine: 9,
      description: `弹出 arr[${popped}]，右侧无更大元素，结果 = -1`,
    }
  }

  yield {
    objects: toBars(arr, [], [], result),
    highlights: [],
    codeLine: 10,
    description: `完成！结果：[${result.map(v => v ?? -1).join(', ')}]`,
  }
}
