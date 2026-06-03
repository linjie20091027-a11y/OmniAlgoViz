import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* hamiltonianGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 6)
  const adj: number[][] = Array.from({ length: n }, () => [])

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
        allEdges.push({
          kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`,
          weight: 1, directed: false, color: '#cbd5e1',
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

  yield {
    objects: [...mkNodes({}), ...allEdges],
    codeLine: 1,
    description: `初始化：${n} 个节点，寻找哈密顿路径（访问每个节点恰好一次）`,
  }

  let found = false
  let finalPath: number[] = []

  function* hamiltonian(u: number, visited: boolean[], path: number[]): Generator<Scene, boolean> {
    visited[u] = true
    path.push(u)

    yield {
      objects: [
        ...mkNodes(Object.fromEntries(path.map((p, idx) => [p, idx === path.length - 1 ? COLORS.comparing : COLORS.sorted]))),
        ...allEdges.map(e => {
          const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
          const fi = path.indexOf(f), ti = path.indexOf(t)
          if (fi >= 0 && ti >= 0 && Math.abs(fi - ti) === 1) return { ...e, color: COLORS.sorted }
          return e
        }),
      ],
      codeLine: 2,
      description: `访问节点 ${u}（深度=${path.length}），路径：[${path.join(' → ')}]`,
    }

    if (path.length === n) {
      yield {
        objects: [
          ...mkNodes(Object.fromEntries(path.map(p => [p, COLORS.sorted]))),
          ...allEdges.map(e => {
            const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
            const fi = path.indexOf(f), ti = path.indexOf(t)
            return fi >= 0 && ti >= 0 && Math.abs(fi - ti) === 1 ? { ...e, color: COLORS.sorted } : e
          }),
        ],
        codeLine: 3,
        description: `找到哈密顿路径！[${path.join(' → ')}]（访问了所有 ${n} 个节点）`,
      }
      return true
    }

    for (const v of adj[u]) {
      if (!visited[v]) {
        yield {
          objects: [
            ...mkNodes({ [v]: COLORS.highlight, ...Object.fromEntries(path.map(p => [p, COLORS.sorted])) }),
            ...allEdges.map(e =>
              (e.from === `n-${u}` && e.to === `n-${v}`) || (e.from === `n-${v}` && e.to === `n-${u}`)
                ? { ...e, color: COLORS.highlight }
                : e
            ),
          ],
          codeLine: 4,
          description: `尝试访问邻居 ${v}（深度=${path.length + 1}）`,
        }

        if (yield* hamiltonian(v, visited, path)) return true

        yield {
          objects: [
            ...mkNodes({ [u]: COLORS.comparing, ...Object.fromEntries(path.filter(p => p !== v).map(p => [p, COLORS.sorted])) }),
            ...allEdges,
          ],
          codeLine: 5,
          description: `从 ${v} 回溯到 ${u}（此路不通），撤销访问`,
        }
      }
    }

    visited[u] = false
    path.pop()

    yield {
      objects: [
        ...mkNodes(Object.fromEntries(path.map(p => [p, COLORS.sorted]))),
        ...allEdges.map(e => {
          const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
          const fi = path.indexOf(f), ti = path.indexOf(t)
          return fi >= 0 && ti >= 0 && Math.abs(fi - ti) === 1 ? { ...e, color: COLORS.sorted } : e
        }),
      ],
      codeLine: 6,
      description: `节点 ${u} 所有邻居均试完，回溯。路径：[${path.join(' → ') || '空'}]`,
    }
    return false
  }

  for (let start = 0; start < n && !found; start++) {
    const visited = Array(n).fill(false)
    const path: number[] = []

    yield {
      objects: [
        ...mkNodes({ [start]: COLORS.highlight }),
        ...allEdges,
      ],
      codeLine: 7,
      description: `尝试从节点 ${start} 开始搜索`,
    }

    found = yield* hamiltonian(start, visited, path)
    if (found) finalPath = [...path]
  }

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(finalPath.length === n
        ? finalPath.map((p, i) => [p, COLORS.sorted])
        : Array.from({ length: n }, (_, i) => [i, COLORS.swapping]))),
      ...allEdges.map(e => {
        const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
        const fi = finalPath.indexOf(f), ti = finalPath.indexOf(t)
        return fi >= 0 && ti >= 0 && Math.abs(fi - ti) === 1 ? { ...e, color: COLORS.sorted } : e
      }),
    ],
    codeLine: 8,
    description: found
      ? `找到哈密顿路径：[${finalPath.join(' → ')}]`
      : `该图不存在哈密顿路径`,
  }
}
