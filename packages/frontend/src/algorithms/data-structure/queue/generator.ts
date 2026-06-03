import type { Scene, ListNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* queueGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const values = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)
  const queue: { id: string; value: number; prev: string | null; next: string | null }[] = []

  function buildListObjects(): ListNodeObject[] {
    return queue.map((nd, i) => ({
      kind: 'listNode' as const,
      id: nd.id,
      value: nd.value,
      prevId: nd.prev,
      nextId: nd.next,
      color: COLORS.default,
      head: i === 0, // 队首标记
    }))
  }

  yield { objects: [], highlights: [], codeLine: 1, description: `初始化空队列` }

  // 入队
  for (let i = 0; i < Math.min(n, 6); i++) {
    const v = values[i]
    const id = `que-${i}`
    const tail = queue.length > 0 ? queue[queue.length - 1] : null
    if (tail) tail.next = id
    queue.push({ id, value: v, prev: tail?.id ?? null, next: null })
    yield {
      objects: buildListObjects().map(o => (o.id === id ? { ...o, color: COLORS.sorted } : o)),
      highlights: [id],
      codeLine: 3,
      description: `enqueue(${v}) → 入队`,
    }
  }

  // 出队
  for (let i = 0; i < 2 && queue.length > 0; i++) {
    const front = queue[0]
    yield {
      objects: buildListObjects().map(o => (o.id === front.id ? { ...o, color: COLORS.comparing } : o)),
      highlights: [front.id],
      codeLine: 6,
      description: `dequeue() → 即将出队队首 ${front.value}`,
    }
    queue.shift()
    if (queue.length > 0) queue[0].prev = null
    yield {
      objects: buildListObjects(),
      highlights: [],
      codeLine: 7,
      description: `dequeue() → 队首已移除，新队首 = ${queue.length > 0 ? queue[0].value : '空'}`,
    }
  }

  yield {
    objects: buildListObjects(),
    highlights: [],
    codeLine: 10,
    description: `队列操作演示完成，队列内 ${queue.length} 个元素`,
  }
}
