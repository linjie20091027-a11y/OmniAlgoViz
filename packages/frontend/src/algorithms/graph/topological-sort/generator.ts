import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* topologicalSortGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 10)
  const adj: number[][] = Array.from({ length: n }, () => [])
  const indegree: number[] = Array(n).fill(0)

  for (let i = 1; i < n; i++) {
    const from = Math.floor(Math.random() * i)
    adj[from].push(i)
    indegree[i]++
  }
  for (let i = 0; i < Math.floor(n * 1.2); i++) {
    const u = Math.floor(Math.random() * n)
    const v = Math.floor(Math.random() * n)
    if (u !== v && !adj[u].includes(v) && v > u) {
      adj[u].push(v)
      indegree[v]++
    }
  }

  const allEdges: GraphEdgeObject[] = []
  for (let u = 0; u < n; u++) {
    for (const v of adj[u]) {
      allEdges.push({
        kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`,
        weight: 1, directed: true, color: '#cbd5e1',
      })
    }
  }

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => ({
      kind: 'graphNode' as const,
      id: `n-${i}`,
      label: `${i}(入度${indegree[i]})`,
      color: states[i] || COLORS.default,
    }))
  }

  yield {
    objects: [...mkNodes({}), ...allEdges],
    codeLine: 1,
    description: `初始化：计算每个节点入度。${n} 个节点的有向无环图`,
  }

  const queue: number[] = []
  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) queue.push(i)
  }

  yield {
    objects: [...mkNodes(Object.fromEntries(queue.map(q => [q, COLORS.sorted]))), ...allEdges],
    codeLine: 2,
    description: `入度为 0 的节点加入队列：[${queue.join(', ')}]`,
  }

  const result: number[] = []

  while (queue.length > 0) {
    const u = queue.shift()!
    result.push(u)

    yield {
      objects: [
        ...mkNodes(Object.fromEntries([
          ...result.map(r => [r, COLORS.sorted] as const),
          ...queue.map(q => [q, COLORS.pivot] as const),
        ])),
        ...allEdges.map(e => {
          const from = parseInt(e.from.slice(2))
          return result.includes(from) ? { ...e, color: COLORS.inactive } : e
        }),
      ],
      codeLine: 3,
      description: `取出节点 ${u}，输出排序：[${result.join(' → ')}]`,
    }

    for (const v of adj[u]) {
      indegree[v]--

      yield {
        objects: [
          ...mkNodes({
            [u]: COLORS.sorted,
            [v]: COLORS.highlight,
            ...Object.fromEntries(result.map(r => [r, COLORS.sorted])),
          }),
          ...allEdges.map(e => {
            if (e.from === `n-${u}` && e.to === `n-${v}`) return { ...e, color: COLORS.highlight }
            const from = parseInt(e.from.slice(2))
            return result.includes(from) ? { ...e, color: COLORS.inactive } : e
          }),
        ],
        codeLine: 4,
        description: `删除边 (${u}→${v})，节点 ${v} 入度减一：${indegree[v]}`,
      }

      if (indegree[v] === 0) {
        queue.push(v)

        yield {
          objects: [
            ...mkNodes(Object.fromEntries([
              ...result.map(r => [r, COLORS.sorted] as const),
              ...queue.map(q => [q, COLORS.pivot] as const),
              [v, COLORS.sorted],
            ])),
            ...allEdges.map(e => {
              const from = parseInt(e.from.slice(2))
              return result.includes(from) ? { ...e, color: COLORS.inactive } : e
            }),
          ],
          codeLine: 5,
          description: `节点 ${v} 入度为 0，加入队列：[${queue.join(', ')}]`,
        }
      }
    }
  }

  if (result.length < n) {
    yield {
      objects: [...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.swapping]))), ...allEdges],
      codeLine: 6,
      description: '图中存在环！拓扑排序无法完成',
    }
  } else {
    yield {
      objects: [
        ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
        ...allEdges.map(() => ({ kind: 'graphEdge' as const, id: '', from: '', to: '', weight: 1, directed: true, color: COLORS.inactive })),
      ],
      codeLine: 6,
      description: `拓扑排序完成！结果：[${result.join(' → ')}]`,
    }
  }
}
