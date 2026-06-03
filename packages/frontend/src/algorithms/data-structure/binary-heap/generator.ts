import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function toBars(heap: number[], size: number, highlights: string[] = [], compareIdx: number | null = null): BarObject[] {
  return heap.map((v, i) => {
    let color = COLORS.default
    if (i >= size) color = COLORS.inactive
    if (highlights.includes(`h-${i}`)) color = COLORS.highlight
    if (compareIdx === i) color = COLORS.comparing
    const parent = i > 0 ? `(父: ${heap[Math.floor((i - 1) / 2)]})` : '(根)'
    return mkBar(`h-${i}`, v, i, color, parent)
  })
}

function* bubbleUp(heap: number[], idx: number): Generator<Scene> {
  while (idx > 0) {
    const parent = Math.floor((idx - 1) / 2)
    if (heap[parent] <= heap[idx]) break
    yield {
      objects: toBars(heap, heap.length, [`h-${parent}`], idx),
      highlights: [`h-${parent}`, `h-${idx}`],
      codeLine: 8,
      description: `上浮：比较 ${heap[parent]} (父) 和 ${heap[idx]} (子)，需交换`,
    }
    ;[heap[parent], heap[idx]] = [heap[idx], heap[parent]]
    idx = parent
  }
}

function* bubbleDown(heap: number[], size: number, idx: number): Generator<Scene> {
  while (true) {
    let smallest = idx
    const left = 2 * idx + 1
    const right = 2 * idx + 2
    if (left < size && heap[left] < heap[smallest]) smallest = left
    if (right < size && heap[right] < heap[smallest]) smallest = right
    if (smallest === idx) break
    yield {
      objects: toBars(heap, size, [`h-${idx}`], smallest),
      highlights: [`h-${idx}`, `h-${smallest}`],
      codeLine: 14,
      description: `下沉：交换 ${heap[idx]} 和较小的子节点 ${heap[smallest]}`,
    }
    ;[heap[idx], heap[smallest]] = [heap[smallest], heap[idx]]
    idx = smallest
  }
}

export default function* binaryHeapGenerator(params: { size: number }): Generator<Scene> {
  const maxN = params.size
  const heap: number[] = []
  const heapSize = { value: 0 }

  yield {
    objects: [],
    highlights: [],
    codeLine: 1,
    description: '初始化空的最小堆',
  }

  const vals = [35, 10, 42, 5, 28, 15, 50, 8].slice(0, maxN)

  for (const val of vals) {
    heap.push(val)
    heapSize.value++
    yield {
      objects: toBars(heap, heapSize.value, [`h-${heapSize.value - 1}`]),
      highlights: [`h-${heapSize.value - 1}`],
      codeLine: 4,
      description: `push(${val}) —— 插入到堆末尾索引 ${heapSize.value - 1}`,
    }
    yield* bubbleUp(heap, heapSize.value - 1)
    yield {
      objects: toBars(heap, heapSize.value),
      highlights: [],
      codeLine: 10,
      description: `${val} 上浮完成，堆顶 = ${heap[0]}`,
    }
  }

  yield {
    objects: toBars(heap, heapSize.value).map((b, i) => {
      if (i === 0) return { ...b, color: COLORS.sorted }
      return b
    }),
    highlights: [],
    codeLine: 11,
    description: `建堆完成，堆顶为最小值 ${heap[0]}`,
  }

  const popVals = heap.slice().sort((a, b) => a - b)
  for (let p = 0; p < Math.min(3, heapSize.value); p++) {
    const min = heap[0]
    yield {
      objects: toBars(heap, heapSize.value, [`h-0`]),
      highlights: [`h-0`],
      codeLine: 12,
      description: `pop() —— 取出堆顶最小值 ${min}`,
    }
    heap[0] = heap[heapSize.value - 1]
    heapSize.value--
    heap.pop()
    if (heapSize.value > 0) {
      yield* bubbleDown(heap, heapSize.value, 0)
    }
  }

  yield {
    objects: toBars(heap, heapSize.value).map(b => ({ ...b, color: COLORS.sorted })),
    highlights: [],
    codeLine: 16,
    description: `弹出操作完成，当前堆大小 = ${heapSize.value}`,
  }
}
