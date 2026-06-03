import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

function toBars(arr: number[], top: number, highlight: number | null = null): BarObject[] {
  return arr.map((v, i) => {
    if (i < top) {
      if (i === highlight) return mkBar(`bar-${i}`, v, i, COLORS.highlight)
      return mkBar(`bar-${i}`, v, i, COLORS.default)
    }
    return mkBar(`bar-${i}`, 0, i, COLORS.inactive)
  })
}

export default function* stackGenerator(params: { size: number }): Generator<Scene> {
  const maxN = params.size
  const arr: number[] = new Array(maxN).fill(0)
  let top = 0

  yield {
    objects: toBars(arr, top),
    highlights: [],
    codeLine: 1,
    description: `初始化空栈，容量 ${maxN}，top = ${top}`,
  }

  const pushVals = [5, 12, 8, 23, 17, 3, 45, 9].slice(0, maxN)

  for (const val of pushVals) {
    if (top >= maxN) {
      yield {
        objects: toBars(arr, top),
        highlights: [],
        codeLine: 3,
        description: `栈已满！无法 push(${val})`,
      }
      break
    }
    arr[top] = val
    yield {
      objects: toBars(arr, top + 1, top),
      highlights: [`bar-${top}`],
      codeLine: 4,
      description: `push(${val}) —— 元素 ${val} 入栈，top 移动到 ${top + 1}`,
    }
    top++
  }

  yield {
    objects: toBars(arr, top),
    highlights: [],
    codeLine: 2,
    description: '所有元素入栈完成',
  }

  const popCount = Math.min(3, top)
  for (let p = 0; p < popCount; p++) {
    const topIdx = top - 1
    yield {
      objects: toBars(arr, top, topIdx),
      highlights: [`bar-${topIdx}`],
      codeLine: 6,
      description: `pop() —— 取出栈顶元素 ${arr[topIdx]}，top 从 ${top} 移动到 ${top - 1}`,
    }
    arr[topIdx] = 0
    top--
  }

  yield {
    objects: toBars(arr, top),
    highlights: [],
    codeLine: 7,
    description: `出栈操作完成，当前栈顶为索引 ${top - 1 >= 0 ? top - 1 : '空'}`,
  }
}
