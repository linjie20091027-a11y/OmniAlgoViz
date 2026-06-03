import type { Scene, TreeNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* heapGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const values = Array.from({ length: n }, () => Math.floor(Math.random() * 60) + 10)
  const heap: number[] = []

  function buildTreeObjects(): TreeNodeObject[] {
    const result: TreeNodeObject[] = []
    for (let i = 0; i < heap.length; i++) {
      const leftIdx = 2 * i + 1
      const rightIdx = 2 * i + 2
      const children: string[] = []
      if (leftIdx < heap.length) children.push(`heap-${leftIdx}`)
      if (rightIdx < heap.length) children.push(`heap-${rightIdx}`)
      result.push({
        kind: 'treeNode',
        id: `heap-${i}`,
        value: heap[i],
        parentId: i === 0 ? null : `heap-${Math.floor((i - 1) / 2)}`,
        children,
        color: i === 0 ? COLORS.sorted : COLORS.default,
      })
    }
    return result
  }

  function* bubbleUp(idx: number): Generator<Scene> {
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2)
      yield {
        objects: buildTreeObjects().map(n =>
          n.id === `heap-${idx}` || n.id === `heap-${parentIdx}` ? { ...n, color: COLORS.comparing } : n
        ),
        highlights: [`heap-${idx}`, `heap-${parentIdx}`],
        codeLine: 6,
        description: `比较节点 ${heap[idx]} 与父节点 ${heap[parentIdx]}`,
      }
      if (heap[idx] >= heap[parentIdx]) break
      ;[heap[idx], heap[parentIdx]] = [heap[parentIdx], heap[idx]]
      yield {
        objects: buildTreeObjects().map(n =>
          n.id === `heap-${idx}` || n.id === `heap-${parentIdx}` ? { ...n, color: COLORS.swapping } : n
        ),
        highlights: [`heap-${idx}`, `heap-${parentIdx}`],
        codeLine: 7,
        description: `交换，${heap[idx]} 上浮`,
      }
      idx = parentIdx
    }
  }

  yield { objects: [], highlights: [], codeLine: 1, description: `构建最小堆，准备插入 ${n} 个元素` }

  for (let i = 0; i < values.length; i++) {
    heap.push(values[i])
    yield {
      objects: buildTreeObjects(),
      highlights: [`heap-${heap.length - 1}`],
      codeLine: 3,
      description: `插入 ${values[i]}`,
    }
    yield* bubbleUp(heap.length - 1)
  }

  yield {
    objects: buildTreeObjects(),
    highlights: [],
    codeLine: 10,
    description: `最小堆构建完成，堆顶 = ${heap[0]}`,
  }
}
