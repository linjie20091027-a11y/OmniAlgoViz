import type { Scene, GraphNodeObject, GraphEdgeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* dfsGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 10)
  const adj: number[][] = Array.from({ length: n }, () => [])

  // 构建随机连通图
  for (let i = 1; i < n; i++) {
    const parent = Math.floor(Math.random() * i)
    adj[parent].push(i)
    adj[i].push(parent)
  }
  for (let i = 0; i < Math.floor(n * 1.5); i++) {
    const u = Math.floor(Math.random() * n)
    const v = Math.floor(Math.random() * n)
    if (u !== v && !adj[u].includes(v)) {
      adj[u].push(v)
      adj[v].push(u)
    }
  }

  const edgeSet = new Set<string>()
  const allEdges: GraphEdgeObject[] = []
  for (let u = 0; u < n; u++) {
    for (const v of adj[u]) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        allEdges.push({ kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`, weight: 1, directed: false, color: '#cbd5e1' })
      }
    }
  }

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => ({
      kind: 'graphNode' as const,
      id: `n-${i}`,
      label: String(i),
      color: states[i] || COLORS.default,
    }))
  }

  const visited: boolean[] = new Array(n).fill(false)
  const entryTime: number[] = new Array(n).fill(-1)
  const exitTime: number[] = new Array(n).fill(-1)
  let timer = 0
  const stack: number[] = []

  // 节点 0 入栈，开始 DFS
  stack.push(0)

  yield {
    objects: [...mkNodes({ 0: COLORS.sorted }), ...allEdges],
    codeLine: 1,
    description: `DFS 从节点 0 开始，栈: [0]`,
  }

  while (stack.length > 0) {
    const u = stack[stack.length - 1]

    if (!visited[u]) {
      visited[u] = true
      entryTime[u] = timer++

      yield {
        objects: [
          ...mkNodes({ [u]: COLORS.highlight, ...Object.fromEntries(stack.map(s => [s, COLORS.pivot])) }),
          ...allEdges,
        ],
        codeLine: 2,
        description: `访问节点 ${u}，发现顺序 = ${entryTime[u]}，栈: [${stack.join(', ')}]`,
      }
    }

    // 寻找下一个未访问的邻居
    let nextV = -1
    for (const v of adj[u]) {
      if (!visited[v]) {
        nextV = v
        break
      }
    }

    if (nextV !== -1) {
      stack.push(nextV)
      yield {
        objects: [
          ...mkNodes({ [u]: COLORS.comparing, [nextV]: COLORS.highlight, ...Object.fromEntries(stack.slice(0, -1).map(s => [s, COLORS.pivot])) }),
          ...allEdges.map(e =>
            (e.from === `n-${u}` && e.to === `n-${nextV}`) || (e.from === `n-${nextV}` && e.to === `n-${u}`)
              ? { ...e, color: COLORS.highlight }
              : e
          ),
        ],
        codeLine: 3,
        description: `从节点 ${u} 深入，发现未访问邻居 ${nextV}，入栈`,
      }
    } else {
      // 没有未访问邻居，回溯
      stack.pop()
      exitTime[u] = timer++

      yield {
        objects: [
          ...mkNodes({ [u]: COLORS.sorted, ...Object.fromEntries(stack.map(s => [s, COLORS.pivot])) }),
          ...allEdges,
        ],
        codeLine: 4,
        description: `节点 ${u} 回溯完成（退出顺序 = ${exitTime[u]}），出栈。栈: [${stack.join(', ') || '空'}]`,
      }
    }
  }

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
      ...allEdges,
    ],
    codeLine: 6,
    description: `DFS 完成！共访问 ${n} 个节点`,
  }
}
