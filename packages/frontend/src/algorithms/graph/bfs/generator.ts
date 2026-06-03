import type { Scene, GraphNodeObject, GraphEdgeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* bfsGenerator(params: { size: number }): Generator<Scene> {
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
  const dist: number[] = new Array(n).fill(-1)
  const queue: number[] = []
  visited[0] = true
  dist[0] = 0
  queue.push(0)

  yield {
    objects: [...mkNodes({ 0: COLORS.sorted }), ...allEdges],
    codeLine: 1,
    description: `BFS 从节点 0 开始，队列: [0]`,
  }

  let idx = 0
  while (idx < queue.length) {
    const u = queue[idx++]
    yield {
      objects: [...mkNodes({ [u]: COLORS.comparing }), ...allEdges],
      codeLine: 4,
      description: `处理节点 ${u}，距离 = ${dist[u]}`,
    }

    for (const v of adj[u]) {
      if (!visited[v]) {
        visited[v] = true
        dist[v] = dist[u] + 1
        queue.push(v)
        const states: Record<number, string> = {}
        states[v] = COLORS.highlight
        for (const qi of queue) states[qi] = COLORS.pivot

        yield {
          objects: [
            ...mkNodes({ [u]: COLORS.comparing, ...states }),
            ...allEdges.map(e =>
              (e.from === `n-${u}` && e.to === `n-${v}`) || (e.from === `n-${v}` && e.to === `n-${u}`)
                ? { ...e, color: COLORS.highlight }
                : e
            ),
          ],
          codeLine: 7,
          description: `发现新节点 ${v}，距离 = ${dist[v]}，入队`,
        }
      }
    }

    const doneStates: Record<number, string> = {}
    for (let i = 0; i < idx; i++) doneStates[queue[i]] = COLORS.sorted
    for (let i = idx; i < queue.length; i++) doneStates[queue[i]] = COLORS.pivot

    yield {
      objects: [
        ...mkNodes({ [u]: COLORS.sorted, ...doneStates }),
        ...allEdges,
      ],
      codeLine: 10,
      description: `节点 ${u} 处理完成，队列: [${queue.slice(idx).join(', ')}]`,
    }
  }

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(queue.map(q => [q, COLORS.sorted]))),
      ...allEdges,
    ],
    codeLine: 14,
    description: `BFS 完成，共访问 ${queue.length} 个节点`,
  }
}
