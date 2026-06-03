import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* kruskalGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 10)
  const adj: number[][] = Array.from({ length: n }, () => [])
  const weight: Record<string, number> = {}
  const sortedEdges: [number, number, number][] = []

  for (let i = 1; i < n; i++) {
    const parent = Math.floor(Math.random() * i)
    adj[parent].push(i)
    adj[i].push(parent)
    const key = parent < i ? `${parent}-${i}` : `${i}-${parent}`
    weight[key] = Math.floor(Math.random() * 9) + 1
    sortedEdges.push([parent, i, weight[key]])
  }
  for (let i = 0; i < Math.floor(n * 1.3); i++) {
    const u = Math.floor(Math.random() * n)
    const v = Math.floor(Math.random() * n)
    if (u !== v && !adj[u].includes(v)) {
      adj[u].push(v)
      adj[v].push(u)
      const key = u < v ? `${u}-${v}` : `${v}-${u}`
      weight[key] = Math.floor(Math.random() * 9) + 1
      sortedEdges.push([u, v, weight[key]])
    }
  }
  sortedEdges.sort((a, b) => a[2] - b[2])

  const edgeSet = new Set<string>()
  const allEdges: GraphEdgeObject[] = []
  for (let u = 0; u < n; u++) {
    for (const v of adj[u]) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        allEdges.push({
          kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`,
          weight: weight[key], directed: false, color: '#cbd5e1',
        })
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

  const parent: number[] = Array.from({ length: n }, (_, i) => i)
  const rank: number[] = Array(n).fill(0)

  function find(x: number): number {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x] }
    return x
  }

  function union(x: number, y: number): boolean {
    const rx = find(x), ry = find(y)
    if (rx === ry) return false
    if (rank[rx] < rank[ry]) parent[rx] = ry
    else if (rank[rx] > rank[ry]) parent[ry] = rx
    else { parent[ry] = rx; rank[rx]++ }
    return true
  }

  const mstEdges: Set<string> = new Set()
  let mstWeight = 0
  let edgeCount = 0

  yield {
    objects: [...mkNodes({}), ...allEdges],
    codeLine: 1,
    description: `初始化：${n} 个节点，${sortedEdges.length} 条边。所有边按权重排序`,
  }

  for (let ei = 0; ei < sortedEdges.length; ei++) {
    const [u, v, w] = sortedEdges[ei]
    const ru = find(u), rv = find(v)

    yield {
      objects: [
        ...mkNodes({ [u]: COLORS.comparing, [v]: COLORS.comparing }),
        ...allEdges.map(e => {
          const from = parseInt(e.from.slice(2)), to = parseInt(e.to.slice(2))
          if ((from === u && to === v) || (from === v && to === u)) return { ...e, color: COLORS.comparing }
          if (mstEdges.has(`${from}-${to}`) || mstEdges.has(`${to}-${from}`)) return { ...e, color: COLORS.sorted }
          return e
        }),
      ],
      codeLine: 2,
      description: `检查边 (${u},${v}) 权重${w}：find(${u})=${ru}，find(${v})=${rv}`,
    }

    if (ru !== rv) {
      union(u, v)
      mstEdges.add(`${u}-${v}`)
      mstEdges.add(`${v}-${u}`)
      mstWeight += w
      edgeCount++

      yield {
        objects: [
          ...mkNodes({ [u]: COLORS.sorted, [v]: COLORS.sorted }),
          ...allEdges.map(e => {
            const from = parseInt(e.from.slice(2)), to = parseInt(e.to.slice(2))
            if (mstEdges.has(`${from}-${to}`)) return { ...e, color: COLORS.sorted }
            return e
          }),
        ],
        codeLine: 3,
        description: `选中边 (${u},${v}) 权重${w}，合并集。MST 边数=${edgeCount}`,
      }

      if (edgeCount === n - 1) break
    } else {
      yield {
        objects: [
          ...mkNodes({ [u]: COLORS.inactive, [v]: COLORS.inactive }),
          ...allEdges.map(e => {
            const from = parseInt(e.from.slice(2)), to = parseInt(e.to.slice(2))
            if ((from === u && to === v) || (from === v && to === u)) return { ...e, color: COLORS.inactive }
            if (mstEdges.has(`${from}-${to}`)) return { ...e, color: COLORS.sorted }
            return e
          }),
        ],
        codeLine: 4,
        description: `跳过边 (${u},${v})：${u} 和 ${v} 已在同一集合，会形成环`,
      }
    }
  }

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
      ...allEdges.map(e => {
        const from = parseInt(e.from.slice(2)), to = parseInt(e.to.slice(2))
        return mstEdges.has(`${from}-${to}`) ? { ...e, color: COLORS.sorted } : { ...e, color: '#e2e8f0' }
      }),
    ],
    codeLine: 5,
    description: `Kruskal 完成！MST 总权重=${mstWeight}，共 ${n - 1} 条边`,
  }
}
