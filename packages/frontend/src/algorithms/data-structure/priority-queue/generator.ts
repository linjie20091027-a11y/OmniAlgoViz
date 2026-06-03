import type { Scene, TreeNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* priorityQueueGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const values = Array.from({ length: n }, () => Math.floor(Math.random() * 60) + 10)
  const heap: number[] = []

  function buildTreeObjects(): TreeNodeObject[] {
    return heap.map((v, i) => ({
      kind: 'treeNode' as const,
      id: `pq-${i}`,
      value: v,
      parentId: i === 0 ? null : `pq-${Math.floor((i - 1) / 2)}`,
      children: [2 * i + 1, 2 * i + 2].filter(j => j < heap.length).map(String),
      color: i === 0 ? COLORS.sorted : COLORS.default,
    }))
  }

  function* bubbleUp(idx: number): Generator<Scene> {
    while (idx > 0) {
      const p = Math.floor((idx - 1) / 2)
      yield {
        objects: buildTreeObjects().map(n =>
          n.id === `pq-${idx}` || n.id === `pq-${p}` ? { ...n, color: COLORS.comparing } : n
        ),
        highlights: [`pq-${idx}`, `pq-${p}`],
        codeLine: 5,
        description: `比较 ${heap[idx]} 与父节点 ${heap[p]}`,
      }
      if (heap[idx] >= heap[p]) break
      ;[heap[idx], heap[p]] = [heap[p], heap[idx]]
      idx = p
    }
  }

  function* bubbleDown(): Generator<Scene> {
    let i = 0
    while (2 * i + 1 < heap.length) {
      let smallest = i
      const l = 2 * i + 1, r = 2 * i + 2
      if (heap[l] < heap[smallest]) smallest = l
      if (r < heap.length && heap[r] < heap[smallest]) smallest = r
      if (smallest === i) break
      yield {
        objects: buildTreeObjects().map(n =>
          n.id === `pq-${i}` || n.id === `pq-${smallest}` ? { ...n, color: COLORS.comparing } : n
        ),
        highlights: [`pq-${i}`, `pq-${smallest}`],
        codeLine: 9,
        description: `下沉：${heap[i]} 与 ${heap[smallest]} 比较`,
      }
      ;[heap[i], heap[smallest]] = [heap[smallest], heap[i]]
      i = smallest
    }
  }

  yield { objects: [], highlights: [], codeLine: 1, description: `优先队列（小根堆）演示` }

  // 插入
  for (const v of values.slice(0, 5)) {
    heap.push(v)
    yield {
      objects: buildTreeObjects(),
      highlights: [`pq-${heap.length - 1}`],
      codeLine: 3,
      description: `入队: ${v}`,
    }
    yield* bubbleUp(heap.length - 1)
  }

  // 出队
  if (heap.length > 1) {
    const top = heap[0]
    yield {
      objects: buildTreeObjects().map(n => n.id === 'pq-0' ? { ...n, color: COLORS.highlight } : n),
      highlights: ['pq-0'],
      codeLine: 11,
      description: `出队: 堆顶 = ${top}`,
    }
    heap[0] = heap.pop()!
    yield* bubbleDown()
  }

  yield { objects: buildTreeObjects(), highlights: [], codeLine: 14, description: `优先队列操作完成` }
}
