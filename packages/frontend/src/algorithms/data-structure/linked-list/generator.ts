import type { Scene, ListNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* linkedListGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const values = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)

  const nodes: { id: string; value: number; prev: string | null; next: string | null }[] = []

  function buildListObjects(): ListNodeObject[] {
    if (nodes.length === 0) return []
    return nodes.map((nd, i) => ({
      kind: 'listNode' as const,
      id: nd.id,
      value: nd.value,
      prevId: nd.prev,
      nextId: nd.next,
      color: COLORS.default,
      head: i === 0,
    }))
  }

  yield {
    objects: [],
    highlights: [],
    codeLine: 1,
    description: `准备构建链表，将插入 ${n} 个节点`,
  }

  for (const v of values) {
    const id = `node-${nodes.length}`
    const prevNode = nodes.length > 0 ? nodes[nodes.length - 1] : null

    if (prevNode) {
      prevNode.next = id
    }

    const newNode = { id, value: v, prev: prevNode?.id ?? null, next: null }
    nodes.push(newNode)

    const objs = buildListObjects().map(o =>
      o.id === id ? { ...o, color: COLORS.sorted } : o
    )
    yield {
      objects: objs,
      highlights: [id],
      codeLine: 4,
      description: `在末尾插入节点，值 = ${v}`,
    }
  }

  // 演示删除操作
  if (nodes.length >= 3) {
    const removeIdx = Math.floor(nodes.length / 2)
    const removedNode = nodes[removeIdx]

    yield {
      objects: buildListObjects().map(o =>
        o.id === removedNode.id ? { ...o, color: COLORS.comparing } : o
      ),
      highlights: [removedNode.id],
      codeLine: 8,
      description: `准备删除节点 ${removedNode.value}（索引 ${removeIdx}）`,
    }

    if (removedNode.prev) {
      const prev = nodes.find(nd => nd.id === removedNode.prev)!
      prev.next = removedNode.next
    }
    if (removedNode.next) {
      const next = nodes.find(nd => nd.id === removedNode.next)!
      next.prev = removedNode.prev
    }
    nodes.splice(removeIdx, 1)

    yield {
      objects: buildListObjects().map(o =>
        o.id === (removedNode.prev ?? '') || o.id === (removedNode.next ?? '') ? { ...o, color: COLORS.swapping } : o
      ),
      highlights: [removedNode.prev ?? '', removedNode.next ?? ''].filter(Boolean),
      codeLine: 11,
      description: `已删除节点 ${removedNode.value}，重新连接前后节点`,
    }
  }

  yield {
    objects: buildListObjects(),
    highlights: [],
    codeLine: 14,
    description: `链表操作完成，共 ${nodes.length} 个节点`,
  }
}
