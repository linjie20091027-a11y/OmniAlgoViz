import type { Scene, ListNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* monotonStackGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1)
  const stack: { id: string; val: number; index: number; prev: string | null; next: string | null }[] = []

  function buildListObjects(): ListNodeObject[] {
    return stack.map((nd, i) => ({
      kind: 'listNode' as const,
      id: nd.id,
      value: nd.val,
      prevId: nd.prev,
      nextId: nd.next,
      color: COLORS.default,
      head: i === stack.length - 1,
    }))
  }

  yield {
    objects: [],
    highlights: [],
    codeLine: 1,
    description: `单调栈找下一个更大元素，数组: [${arr.join(', ')}]`,
  }

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && stack[stack.length - 1].val < arr[i]) {
      const popped = stack[stack.length - 1]
      yield {
        objects: buildListObjects().map(o => o.id === popped.id ? { ...o, color: COLORS.swapping } : o),
        highlights: [popped.id],
        codeLine: 4,
        description: `arr[${i}]=${arr[i]} > 栈顶 ${popped.val}（来自 arr[${popped.index}]），弹出`,
      }
      const prev = stack.length > 1 ? stack[stack.length - 2] : null
      stack.pop()
      if (stack.length > 0) stack[stack.length - 1].next = null
    }
    const id = `ms-${i}`
    const prevTop = stack.length > 0 ? stack[stack.length - 1] : null
    if (prevTop) prevTop.next = id
    stack.push({ id, val: arr[i], index: i, prev: prevTop?.id ?? null, next: null })
    yield {
      objects: buildListObjects().map(o => o.id === id ? { ...o, color: COLORS.sorted } : o),
      highlights: [id],
      codeLine: 7,
      description: `压入 arr[${i}]=${arr[i]}，栈单调递减`,
    }
  }

  yield { objects: buildListObjects(), highlights: [], codeLine: 10, description: `处理完成，栈内剩余 ${stack.length} 个元素` }
}
