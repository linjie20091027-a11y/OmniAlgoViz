import type { Scene, ListNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* stackGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const values = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)
  const stack: { id: string; value: number; prev: string | null; next: string | null }[] = []

  function buildListObjects(): ListNodeObject[] {
    return stack.map((nd, i) => ({
      kind: 'listNode' as const,
      id: nd.id,
      value: nd.value,
      prevId: nd.prev,
      nextId: nd.next,
      color: COLORS.default,
      head: i === stack.length - 1, // 栈顶标记
    }))
  }

  yield { objects: [], highlights: [], codeLine: 1, description: `初始化空栈` }

  // 压栈操作
  for (let i = 0; i < Math.min(n, 6); i++) {
    const v = values[i]
    const id = `stk-${i}`
    const prevTop = stack.length > 0 ? stack[stack.length - 1] : null
    if (prevTop) prevTop.next = id
    stack.push({ id, value: v, prev: prevTop?.id ?? null, next: null })
    yield {
      objects: buildListObjects().map(o => (o.id === id ? { ...o, color: COLORS.sorted } : o)),
      highlights: [id],
      codeLine: 3,
      description: `push(${v}) → 入栈，栈顶现在为 ${v}`,
    }
  }

  // 弹栈操作
  for (let i = 0; i < 2 && stack.length > 0; i++) {
    const top = stack[stack.length - 1]
    yield {
      objects: buildListObjects().map(o => (o.id === top.id ? { ...o, color: COLORS.comparing } : o)),
      highlights: [top.id],
      codeLine: 6,
      description: `pop() → 即将弹出栈顶 ${top.value}`,
    }
    stack.pop()
    if (stack.length > 0) stack[stack.length - 1].next = null
    yield {
      objects: buildListObjects(),
      highlights: [],
      codeLine: 7,
      description: `pop() → 栈顶已移除，当前栈顶 = ${stack.length > 0 ? stack[stack.length - 1].value : '空'}`,
    }
  }

  yield {
    objects: buildListObjects(),
    highlights: [],
    codeLine: 10,
    description: `栈操作演示完成，栈内 ${stack.length} 个元素`,
  }
}
