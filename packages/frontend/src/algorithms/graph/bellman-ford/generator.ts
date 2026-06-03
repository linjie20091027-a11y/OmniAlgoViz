import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* bellmanFordGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 8)
  const adj: [number, number][][] = Array.from({ length: n }, () => [])
  const edgeList: [number, number, number][] = []
  const edgeIdx: Record<string, number> = {}

  for (let i = 1; i < n; i++) {
    const parent = Math.floor(Math.random() * i)
    const w = Math.floor(Math.random() * 9) + 1
    adj[parent].push([i, w])
    edgeList.push([parent, i, w])
    edgeIdx[`${parent}-${i}`] = edgeList.length - 1
  }
  for (let i = 0; i < Math.floor(n * 1.2); i++) {
    const u = Math.floor(Math.random() * n)
    const v = Math.floor(Math.random() * n)
    if (u !== v && !adj[u].some(([t]) => t === v)) {
      const w = Math.floor(Math.random() * 9) + 1
      adj[u].push([v, w])
      edgeList.push([u, v, w])
      edgeIdx[`${u}-${v}`] = edgeList.length - 1
    }
  }
  if (edgeList.some(([u, v]) => u === 0 && v === 1)) {
    edgeList.push([0, 1, -3])
  }

  const allEdges: GraphEdgeObject[] = []
  for (const [u, v, w] of edgeList) {
    allEdges.push({
      kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`,
      weight: w, directed: true, color: '#cbd5e1',
    })
  }

  const INF = 999
  const dist: number[] = new Array(n).fill(INF)
  dist[0] = 0

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => {
      const d = dist[i]
      const lbl = d === INF ? `${i}(INF)` : `${i}(${d})`
      return { kind: 'graphNode', id: `n-${i}`, label: lbl, color: states[i] || COLORS.default }
    })
  }

  yield {
    objects: [...mkNodes({ 0: COLORS.sorted }), ...allEdges],
    codeLine: 1,
    description: `初始化：源节点 0 距离=0，其余为 INF。共 ${edgeList.length} 条边`,
  }

  for (let iter = 1; iter <= n - 1; iter++) {
    let relaxed = false

    yield {
      objects: [...mkNodes({ 0: COLORS.sorted }), ...allEdges],
      codeLine: 2,
      description: `=== 第 ${iter} 轮松弛 ===（共需 ${n - 1} 轮）`,
    }

    for (let ei = 0; ei < edgeList.length; ei++) {
      const [u, v, w] = edgeList[ei]
      if (dist[u] === INF) continue

      const newDist = dist[u] + w
      const states: Record<number, string> = { [u]: COLORS.comparing, [v]: COLORS.highlight }

      if (newDist < dist[v]) {
        const oldDist = dist[v]
        dist[v] = newDist
        relaxed = true

        yield {
          objects: [
            ...mkNodes(states),
            ...allEdges.map((e, i) => i === ei ? { ...e, color: COLORS.highlight } : e),
          ],
          codeLine: 3,
          description: `松弛边 (${u}→${v}) 权重${w}：dist[${v}] ${oldDist === INF ? 'INF' : oldDist} → ${newDist}`,
        }
      } else if (dist[v] !== INF) {
        yield {
          objects: [...mkNodes(states)],
          codeLine: 4,
          description: `边 (${u}→${v})：dist[${v}]=${dist[v]} ≥ ${dist[u]}+${w}=${newDist}，不更新`,
        }
      }
    }

    if (!relaxed) {
      yield {
        objects: [...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted])))],
        codeLine: 5,
        description: `第 ${iter} 轮无松弛，提前终止`,
      }
      break
    }
  }

  let hasNegativeCycle = false
  for (const [u, v, w] of edgeList) {
    if (dist[u] !== INF && dist[u] + w < dist[v]) {
      hasNegativeCycle = true
      break
    }
  }

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
      ...allEdges.map(e => ({ ...e, color: hasNegativeCycle ? '#ef4444' : '#cbd5e1' })),
    ],
    codeLine: 6,
    description: hasNegativeCycle
      ? '检测到负权环！图中存在负权环，无最短路径'
      : `Bellman-Ford 完成！所有节点最短距离已求出`,
  }
}
