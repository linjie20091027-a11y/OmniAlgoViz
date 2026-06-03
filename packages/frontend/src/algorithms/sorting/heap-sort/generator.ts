import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

function toBars(arr: number[], highlights: string[] = [], compareIdx: number[] = [], sortedFrom: number = -1): BarObject[] {
  return arr.map((v, i) => {
    let color = COLORS.default
    if (highlights.includes(`bar-${i}`)) color = COLORS.highlight
    if (compareIdx.includes(i)) color = COLORS.comparing
    if (sortedFrom >= 0 && i >= sortedFrom) color = COLORS.sorted
    return mkBar(`bar-${i}`, v, i, color)
  })
}

export default function* heapSort(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)

  yield { objects: toBars(arr), highlights: [], codeLine: 1, description: '初始随机数组' }

  function* heapify(heapSize: number, root: number): Generator<Scene> {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2

    if (left < heapSize) {
      yield {
        objects: toBars(arr, [], [largest, left]),
        highlights: [],
        codeLine: 5,
        description: `比较 arr[${largest}]=${arr[largest]} 与左子 arr[${left}]=${arr[left]}`,
      }
      if (arr[left] > arr[largest]) {
        largest = left
      }
    }

    if (right < heapSize) {
      yield {
        objects: toBars(arr, [], [largest, right]),
        highlights: [],
        codeLine: 7,
        description: `比较 arr[${largest}]=${arr[largest]} 与右子 arr[${right}]=${arr[right]}`,
      }
      if (arr[right] > arr[largest]) {
        largest = right
      }
    }

    if (largest !== root) {
      ;[arr[root], arr[largest]] = [arr[largest], arr[root]]
      yield {
        objects: toBars(arr, [`bar-${root}`, `bar-${largest}`]),
        highlights: [`bar-${root}`, `bar-${largest}`],
        codeLine: 11,
        description: `交换 arr[${root}] 和 arr[${largest}]，继续向下调整`,
      }
      yield* heapify(heapSize, largest)
    }
  }

  yield { objects: toBars(arr), highlights: [], codeLine: 13, description: '开始建堆（build max heap）' }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield {
      objects: toBars(arr),
      highlights: [],
      codeLine: 14,
      description: `从节点 arr[${i}] 开始向下调整（heapify）`,
    }
    yield* heapify(n, i)
  }

  yield {
    objects: toBars(arr),
    highlights: [],
    codeLine: 16,
    description: '最大堆构建完成，开始提取最大值',
  }

  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    yield {
      objects: toBars(arr, [`bar-${0}`, `bar-${i}`], [], i),
      highlights: [`bar-${0}`, `bar-${i}`],
      codeLine: 18,
      description: `交换堆顶 arr[0]=${arr[i]} 到末尾 arr[${i}]，最大值归位`,
    }

    yield {
      objects: toBars(arr, [], [], i),
      highlights: [],
      codeLine: 19,
      description: `重新调整剩余堆（size = ${i}）`,
    }
    yield* heapify(i, 0)
  }

  const allSorted = arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.sorted))
  yield { objects: allSorted, highlights: [], codeLine: 21, description: '排序完成！' }
}
