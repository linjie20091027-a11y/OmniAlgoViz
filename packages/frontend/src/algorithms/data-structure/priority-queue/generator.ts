import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function toBars(heap: number[], size: number, highlights: string[] = [], focusVal: number | null = null): BarObject[] {
  return heap.map((v, i) => {
    let color = COLORS.default
    if (i >= size) color = COLORS.inactive
    if (highlights.includes(`pq-${i}`)) color = COLORS.highlight
    if (focusVal === v) color = COLORS.comparing
    const priority = `优先级:${v}`
    return mkBar(`pq-${i}`, v, i, color, priority)
  })
}

function* bubbleUp(heap: number[], size: number, idx: number): Generator<Scene> {
  while (idx > 0) {
    const parent = Math.floor((idx - 1) / 2)
    if (heap[parent] <= heap[idx]) break
    yield {
      objects: toBars(heap, size, [`pq-${parent}`, `pq-${idx}`]),
      highlights: [`pq-${parent}`, `pq-${idx}`],
      codeLine: 6,
      description: `上浮：${heap[parent]} 的优先级低于 ${heap[idx]}，向上交换`,
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
      objects: toBars(heap, size, [`pq-${idx}`, `pq-${smallest}`]),
      highlights: [`pq-${idx}`, `pq-${smallest}`],
      codeLine: 13,
      description: `下沉：${heap[idx]} 与更高优先级子节点 ${heap[smallest]} 交换`,
    }
    ;[heap[idx], heap[smallest]] = [heap[smallest], heap[idx]]
    idx = smallest
  }
}

export default function* priorityQueueGenerator(params: { size: number }): Generator<Scene> {
  const maxN = params.size
  const heap: number[] = []
  let size = 0

  yield {
    objects: [],
    highlights: [],
    codeLine: 1,
    description: '初始化空优先队列（数字越小优先级越高 —— 最小堆）',
  }

  const tasks = [7, 3, 9, 1, 5, 2, 8, 4].slice(0, maxN)

  for (const pri of tasks) {
    heap.push(pri)
    size++
    yield {
      objects: toBars(heap, size, [`pq-${size - 1}`]),
      highlights: [`pq-${size - 1}`],
      codeLine: 3,
      description: `enqueue(priority=${pri}) —— 新任务加入队尾位置 ${size - 1}`,
    }
    yield* bubbleUp(heap, size, size - 1)
  }

  yield {
    objects: toBars(heap, size).map((b, i) => {
      if (i === 0) return { ...b, color: COLORS.sorted }
      return b
    }),
    highlights: [],
    codeLine: 8,
    description: `入队完毕，队首为最高优先级任务，优先级 = ${heap[0]}`,
  }

  const deqCount = Math.min(3, size)
  for (let d = 0; d < deqCount; d++) {
    const top = heap[0]
    yield {
      objects: toBars(heap, size, [`pq-0`]),
      highlights: [`pq-0`],
      codeLine: 10,
      description: `dequeue() —— 取出最高优先级任务，优先级 = ${top}`,
    }
    heap[0] = heap[size - 1]
    size--
    heap.pop()
    if (size > 0) {
      yield* bubbleDown(heap, size, 0)
    }
  }

  yield {
    objects: toBars(heap, size).map(b => ({ ...b, color: COLORS.sorted })),
    highlights: [],
    codeLine: 15,
    description: `出队完成，当前队列大小 = ${size}`,
  }
}
