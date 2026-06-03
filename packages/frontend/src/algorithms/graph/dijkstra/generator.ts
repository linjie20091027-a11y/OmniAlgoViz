import type { Scene, GraphNodeObject, GraphEdgeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* dijkstraGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 10)
  const adj: number[][] = Array.from({ length: n }, () => [])
  const weight: Record<string, number> = {}

  // 构建随机加权连通图
  for (let i = 1; i < n; i++) {
    const parent = Math.floor(Math.random() * i)
    adj[parent].push(i)
    adj[i].push(parent)
    const wkey = parent < i ? `${parent}-${i}` : `${i}-${parent}`
    weight[wkey] = Math.floor(Math.random() * 9) + 1
  }
  for (let i = 0; i < Math.floor(n * 1.5); i++) {
    const u = Math.floor(Math.random() * n)
    const v = Math.floor(Math.random() * n)
    if (u !== v && !adj[u].includes(v)) {
      adj[u].push(v)
      adj[v].push(u)
      const wkey = u < v ? `${u}-${v}` : `${v}-${u}`
      weight[wkey] = Math.floor(Math.random() * 9) + 1
    }
  }

  const edgeSet = new Set<string>()
  const allEdges: GraphEdgeObject[] = []
  for (let u = 0; u < n; u++) {
    for (const v of adj[u]) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        allEdges.push({
          kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`,
          weight: weight[key], directed: true, color: '#cbd5e1',
        })
      }
    }
  }

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => {
      const d = dist[i]
      const lbl = d === INF ? `${i}(INF)` : `${i}(${d})`
      return {
        kind: 'graphNode' as const,
        id: `n-${i}`,
        label: lbl,
        color: states[i] || COLORS.default,
      }
    })
  }

  const INF = 999
  const dist: number[] = new Array(n).fill(INF)
  const settled: boolean[] = new Array(n).fill(false)
  dist[0] = 0

  yield {
    objects: [...mkNodes({ 0: COLORS.sorted }), ...allEdges],
    codeLine: 1,
    description: `初始化：源节点 0（dist=0），其余节点 dist=INF`,
  }

  for (let iter = 0; iter < n; iter++) {
    let u = -1
    let minDist = INF
    for (let i = 0; i < n; i++) {
      if (!settled[i] && dist[i] < minDist) {
        u = i
        minDist = dist[i]
      }
    }
    if (u === -1 || minDist === INF) break

    yield {
      objects: [...mkNodes({ [u]: COLORS.comparing }), ...allEdges],
      codeLine: 3,
      description: `从未确定节点中选择距离最小的：节点 ${u}（dist=${minDist}）`,
    }

    settled[u] = true

    yield {
      objects: [
        ...mkNodes({ [u]: COLORS.sorted, ...Object.fromEntries(
          Array.from({ length: n }, (_, i) => settled[i] ? [i, COLORS.sorted] : null).filter(Boolean) as [number, string][]
        ) }),
        ...allEdges,
      ],
      codeLine: 4,
      description: `节点 ${u} 的最短路径已确定，标记为已确定`,
    }

    // 松弛相邻边
    for (const v of adj[u]) {
      if (settled[v]) continue
      const wkey = u < v ? `${u}-${v}` : `${v}-${u}`
      const w = weight[wkey]
      const newDist = dist[u] + w

      if (newDist < dist[v]) {
        const oldDist = dist[v]
        dist[v] = newDist

        yield {
          objects: [
            ...mkNodes({ [u]: COLORS.sorted, [v]: COLORS.highlight }),
            ...allEdges.map(e =>
              (e.from === `n-${u}` && e.to === `n-${v}`) || (e.from === `n-${v}` && e.to === `n-${u}`)
                ? { ...e, color: COLORS.highlight }
                : e
            ),
          ],
          codeLine: 5,
          description: `松弛边 (${u}→${v}) 权重${w}：dist[${v}] ${oldDist === INF ? 'INF' : oldDist} → ${newDist}（${dist[u]}+${w}）`,
        }
      }
    }
  }

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
      ...allEdges,
    ],
    codeLine: 8,
    description: `Dijkstra 完成！所有节点最短距离已求出`,
  }
}
