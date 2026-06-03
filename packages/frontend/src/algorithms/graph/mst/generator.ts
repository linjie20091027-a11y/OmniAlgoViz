import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* mstGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 8)
  const adj: [number, number][][] = Array.from({ length: n }, () => [])
  const weight: Record<string, number> = {}
  const allSortedEdges: [number, number, number][] = []

  for (let i = 1; i < n; i++) {
    const parent = Math.floor(Math.random() * i)
    adj[parent].push([i, Math.floor(Math.random() * 9) + 1])
    adj[i].push([parent, weight[`${parent}-${i}`]])
    const w = adj[parent][adj[parent].length - 1][1]
    const key = parent < i ? `${parent}-${i}` : `${i}-${parent}`
    weight[key] = w
    allSortedEdges.push([parent, i, w])
  }
  for (let i = 0; i < Math.floor(n * 1.2); i++) {
    const u = Math.floor(Math.random() * n)
    const v = Math.floor(Math.random() * n)
    if (u !== v && !adj[u].some(([t]) => t === v)) {
      const w = Math.floor(Math.random() * 9) + 1
      adj[u].push([v, w])
      adj[v].push([u, w])
      const key = u < v ? `${u}-${v}` : `${v}-${u}`
      weight[key] = w
      allSortedEdges.push([u, v, w])
    }
  }
  allSortedEdges.sort((a, b) => a[2] - b[2])

  const edgeSet = new Set<string>()
  const allEdges: GraphEdgeObject[] = []
  for (let u = 0; u < n; u++) {
    for (const [v, w] of adj[u]) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        allEdges.push({
          kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`,
          weight: w, directed: false, color: '#cbd5e1',
        })
      }
    }
  }

  function mkNodes(states: Record<number, string>, prefix: string = ''): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => ({
      kind: 'graphNode' as const,
      id: `n-${i}`,
      label: `${prefix}${i}`,
      color: states[i] || COLORS.default,
    }))
  }

  yield {
    objects: [...mkNodes({}), ...allEdges],
    codeLine: 1,
    description: `加权连通图：${n} 个节点，${allEdges.length} 条边。分别用 Kruskal 和 Prim 求 MST`,
  }

  yield {
    objects: [
      ...mkNodes({}),
      ...allEdges.map(e => ({ ...e, color: '#8b5cf6' })),
    ],
    codeLine: 2,
    description: '【Kruskal 策略】边按权重排序，用并查集逐条检查，不形成环则选中',
  }

  {
    const parent: number[] = Array.from({ length: n }, (_, i) => i)
    const rank: number[] = Array(n).fill(0)
    function find(x: number): number { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x] } return x }
    function union(x: number, y: number): boolean {
      const rx = find(x), ry = find(y); if (rx === ry) return false
      if (rank[rx] < rank[ry]) parent[rx] = ry; else if (rank[rx] > rank[ry]) parent[ry] = rx; else { parent[ry] = rx; rank[rx]++ }
      return true
    }

    const kruskalMST = new Set<string>()
    let kWeight = 0

    for (const [u, v, w] of allSortedEdges) {
      if (union(u, v)) {
        kruskalMST.add(`${u}-${v}`)
        kruskalMST.add(`${v}-${u}`)
        kWeight += w

        yield {
          objects: [
            ...mkNodes({ [u]: COLORS.comparing, [v]: COLORS.comparing }),
            ...allEdges.map(e => {
              const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
              return kruskalMST.has(`${f}-${t}`) ? { ...e, color: '#8b5cf6' } : e
            }),
          ],
          codeLine: 3,
          description: `[Kruskal] 选中边 (${u},${v}) 权重${w}，累计=${kWeight}`,
        }
      }
    }

    yield {
      objects: [
        ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
        ...allEdges.map(e => {
          const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
          return kruskalMST.has(`${f}-${t}`) ? { ...e, color: '#8b5cf6' } : { ...e, color: '#e2e8f0' }
        }),
      ],
      codeLine: 4,
      description: `[Kruskal 完成] MST 总权重=${kWeight}`,
    }
  }

  yield {
    objects: [
      ...mkNodes({}),
      ...allEdges.map(e => ({ ...e, color: '#06b6d4' })),
    ],
    codeLine: 5,
    description: '【Prim 策略】从节点 0 开始，每次选与已选集合相连的最小权边',
  }

  {
    const INF = 999
    const key: number[] = Array(n).fill(INF)
    const visited: boolean[] = Array(n).fill(false)
    const primMST = new Set<string>()
    key[0] = 0
    let pWeight = 0

    for (let iter = 0; iter < n; iter++) {
      let u = -1, minKey = INF
      for (let i = 0; i < n; i++) { if (!visited[i] && key[i] < minKey) { u = i; minKey = key[i] } }
      if (u === -1) break

      visited[u] = true
      if (iter > 0) pWeight += key[u]

      yield {
        objects: [
          ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => visited[i] ? [i, COLORS.comparing] : [i, null]).filter(([, v]) => v !== null) as [number, string][])),
          ...allEdges.map(e => {
            const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
            return primMST.has(`${f}-${t}`) ? { ...e, color: '#06b6d4' } : e
          }),
        ],
        codeLine: 6,
        description: `[Prim] 选中节点 ${u}${iter === 0 ? '（起点）' : `（key=${key[u]}）`}`,
      }

      for (const [v, w] of adj[u]) {
        if (!visited[v] && w < key[v]) {
          key[v] = w
          const ek = u < v ? `${u}-${v}` : `${v}-${u}`
          primMST.add(`${u}-${v}`)
          primMST.add(`${v}-${u}`)

          yield {
            objects: [
              ...mkNodes({ [u]: COLORS.comparing, [v]: COLORS.highlight }),
              ...allEdges.map(e => {
                const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
                if (primMST.has(`${f}-${t}`)) return { ...e, color: '#06b6d4' }
                return (e.from === `n-${u}` && e.to === `n-${v}`) || (e.from === `n-${v}` && e.to === `n-${u}`)
                  ? { ...e, color: COLORS.highlight }
                  : e
              }),
            ],
            codeLine: 6,
            description: `[Prim] 更新节点 ${v} 的 key = ${w}`,
          }
        }
      }
    }

    yield {
      objects: [
        ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
        ...allEdges.map(e => {
          const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
          return primMST.has(`${f}-${t}`) ? { ...e, color: '#06b6d4' } : { ...e, color: '#e2e8f0' }
        }),
      ],
      codeLine: 7,
      description: `[Prim 完成] MST 总权重=${pWeight}`,
    }
  }

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
      ...allEdges.map(e => ({ ...e, color: COLORS.sorted })),
    ],
    codeLine: 8,
    description: '【总结】Kruskal 以边为中心，适合稀疏图；Prim 以顶点为中心，适合稠密图',
  }
}
