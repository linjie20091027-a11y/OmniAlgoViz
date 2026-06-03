import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* spfaGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 10)
  const adj: [number, number][][] = Array.from({ length: n }, () => [])
  const edgeList: [number, number, number][] = []

  for (let i = 1; i < n; i++) {
    const parent = Math.floor(Math.random() * i)
    const w = Math.floor(Math.random() * 9) + 1
    adj[parent].push([i, w])
    edgeList.push([parent, i, w])
  }
  for (let i = 0; i < Math.floor(n * 1.2); i++) {
    const u = Math.floor(Math.random() * n)
    const v = Math.floor(Math.random() * n)
    if (u !== v && !adj[u].some(([t]) => t === v)) {
      const w = Math.floor(Math.random() * 9) + 1
      adj[u].push([v, w])
      edgeList.push([u, v, w])
    }
  }

  const allEdges: GraphEdgeObject[] = []
  for (const [u, v, w] of edgeList) {
    allEdges.push({
      kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`,
      weight: w, directed: true, color: '#cbd5e1',
    })
  }

  const INF = 999
  const dist: number[] = Array(n).fill(INF)
  const inQueue: boolean[] = Array(n).fill(false)
  const count: number[] = Array(n).fill(0)
  const queue: number[] = []
  dist[0] = 0
  queue.push(0)
  inQueue[0] = true
  let hasNegativeCycle = false

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => {
      const d = dist[i]
      const lbl = d === INF ? `${i}(INF)` : `${i}(${d})`
      return { kind: 'graphNode' as const, id: `n-${i}`, label: lbl, color: states[i] || COLORS.default }
    })
  }

  yield {
    objects: [...mkNodes({ 0: COLORS.sorted }), ...allEdges],
    codeLine: 1,
    description: `初始化：源节点 0 距离=0 并入队，其余 INF。共 ${edgeList.length} 条有向边`,
  }

  while (queue.length > 0 && !hasNegativeCycle) {
    const u = queue.shift()!
    inQueue[u] = false

    yield {
      objects: [
        ...mkNodes({ [u]: COLORS.comparing }),
        ...allEdges,
      ],
      codeLine: 2,
      description: `从队列取出节点 ${u}（dist=${dist[u]}），队列：[${queue.join(', ') || '空'}]`,
    }

    for (let ei = 0; ei < adj[u].length; ei++) {
      const [v, w] = adj[u][ei]
      if (dist[u] === INF) continue
      const newDist = dist[u] + w

      if (newDist < dist[v]) {
        const oldDist = dist[v]
        dist[v] = newDist

        const edgeId = edgeList.findIndex(([a, b]) => a === u && b === v)

        yield {
          objects: [
            ...mkNodes({ [u]: COLORS.comparing, [v]: COLORS.highlight }),
            ...allEdges.map((e, i) => i === edgeId ? { ...e, color: COLORS.highlight } : e),
          ],
          codeLine: 3,
          description: `松弛边 (${u}→${v}) 权重${w}：dist[${v}] ${oldDist === INF ? 'INF' : oldDist} → ${newDist}`,
        }

        if (!inQueue[v]) {
          queue.push(v)
          inQueue[v] = true
          count[v]++

          yield {
            objects: [
              ...mkNodes({ [v]: COLORS.pivot, ...Object.fromEntries(queue.map(q => [q, COLORS.pivot])) }),
              ...allEdges,
            ],
            codeLine: 4,
            description: `${v} 入队（入队次数=${count[v]}），队列：[${queue.join(', ')}]`,
          }

          if (count[v] >= n) {
            hasNegativeCycle = true

            yield {
              objects: [
                ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.swapping]))),
                ...allEdges,
              ],
              codeLine: 5,
              description: `节点 ${v} 入队 ${count[v]} 次 ≥ ${n}，检测到负权环！`,
            }
            break
          }
        }
      }
    }
  }

  const color = hasNegativeCycle ? COLORS.swapping : COLORS.sorted

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, color]))),
      ...allEdges,
    ],
    codeLine: 6,
    description: hasNegativeCycle
      ? 'SPFA 终止：图中存在负权环！'
      : 'SPFA 完成！所有最短距离已求出',
  }
}
