import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* eulerPathGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 8)
  const adj: number[][] = Array.from({ length: n }, () => [])

  for (let i = 1; i < n; i++) {
    const parent = Math.floor(Math.random() * i)
    adj[parent].push(i)
    adj[i].push(parent)
  }
  for (let i = 0; i < Math.floor(n * 1.2); i++) {
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

  const degree = adj.map(a => a.length)
  const oddNodes = degree.map((d, i) => d % 2 !== 0 ? i : -1).filter(i => i !== -1)

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => ({
      kind: 'graphNode' as const,
      id: `n-${i}`,
      label: `${i}(度${degree[i]})`,
      color: states[i] || (oddNodes.includes(i) ? '#f59e0b' : COLORS.default),
    }))
  }

  yield {
    objects: [...mkNodes({}), ...allEdges],
    codeLine: 1,
    description: `计算度数：奇数度节点=${oddNodes.length} 个${oddNodes.length > 2 ? '（>2，无欧拉路径）' : ''}`,
  }

  if (oddNodes.length > 2) {
    yield {
      objects: [
        ...mkNodes(Object.fromEntries(oddNodes.map(o => [o, COLORS.swapping]))),
        ...allEdges,
      ],
      codeLine: 2,
      description: `奇数度节点 ${oddNodes.length} > 2，不存在欧拉路径！`,
    }
  } else {
    const start = oddNodes.length > 0 ? oddNodes[0] : 0

    yield {
      objects: [
        ...mkNodes({ [start]: COLORS.highlight }),
        ...allEdges,
      ],
      codeLine: 2,
      description: `${oddNodes.length === 0 ? '存在欧拉回路' : `存在欧拉路径，起点=${start}`}，开始 Hierholzer`,
    }

    const adjCopy: number[][] = adj.map(a => [...a])
    const stack: number[] = [start]
    const path: number[] = []
    const removedEdges = new Set<string>()

    while (stack.length > 0) {
      const u = stack[stack.length - 1]

      if (adjCopy[u].length > 0) {
        const v = adjCopy[u].pop()!
        const vi = adjCopy[v].indexOf(u)
        if (vi !== -1) adjCopy[v].splice(vi, 1)
        removedEdges.add(`${u}-${v}`)
        removedEdges.add(`${v}-${u}`)
        stack.push(v)

        yield {
          objects: [
            ...mkNodes({ [u]: COLORS.comparing, [v]: COLORS.highlight, ...Object.fromEntries(stack.map(s => [s, COLORS.pivot])) }),
            ...allEdges.map(e => {
              const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
              return removedEdges.has(`${f}-${t}`) ? { ...e, color: COLORS.inactive } : e
            }),
          ],
          codeLine: 3,
          description: `从 ${u} 走到 ${v}，边已删除。栈：[${stack.join(', ')}]`,
        }
      } else {
        const w = stack.pop()!
        path.push(w)

        yield {
          objects: [
            ...mkNodes(Object.fromEntries([
              ...path.map(p => [p, COLORS.sorted] as const),
              ...stack.map(s => [s, COLORS.pivot] as const),
            ])),
            ...allEdges.map(e => {
              const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
              return removedEdges.has(`${f}-${t}`) ? { ...e, color: COLORS.inactive } : e
            }),
          ],
          codeLine: 4,
          description: `节点 ${u} 无边可走，出栈加入路径 → [${path.join(', ')}]`,
        }
      }
    }

    yield {
      objects: [
        ...mkNodes(Object.fromEntries(path.map(p => [p, COLORS.sorted]))),
        ...allEdges.map(e => {
          const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
          return removedEdges.has(`${f}-${t}`) ? { ...e, color: COLORS.inactive } : e
        }),
      ],
      codeLine: 5,
      description: `Hierholzer 完成！欧拉路径：[${path.join(' → ')}]`,
    }
  }
}
