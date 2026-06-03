import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* dinicGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 8)
  const source = 0
  const sink = n - 1
  const capacity: number[][] = Array.from({ length: n }, () => Array(n).fill(0))
  const flow: number[][] = Array.from({ length: n }, () => Array(n).fill(0))
  const edgeExists = new Set<string>()

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && Math.random() < 0.35) {
        capacity[i][j] = Math.floor(Math.random() * 15) + 5
        edgeExists.add(`${i}-${j}`)
      }
    }
  }

  if (!edgeExists.has(`${source}-${source + 1}`)) {
    capacity[source][source + 1] = 16
    edgeExists.add(`${source}-${source + 1}`)
    capacity[source + 1][source] = 0
  }
  if (!edgeExists.has(`${sink - 1}-${sink}`)) {
    capacity[sink - 1][sink] = 20
    edgeExists.add(`${sink - 1}-${sink}`)
  }
  if (n >= 6 && !edgeExists.has(`${n - 2}-${n - 1}`)) {
    capacity[n - 2][n - 1] = 12
    edgeExists.add(`${n - 2}-${n - 1}`)
  }

  const allEdges: GraphEdgeObject[] = []
  for (let u = 0; u < n; u++) {
    for (let v = 0; v < n; v++) {
      if (capacity[u][v] > 0) {
        allEdges.push({
          kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`,
          weight: capacity[u][v], directed: true, color: '#cbd5e1',
        })
      }
    }
  }

  function getEdgeId(from: number, to: number): number {
    return allEdges.findIndex(e => e.from === `n-${from}` && e.to === `n-${to}`)
  }

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => {
      const lbl = i === source ? `S(${i})` : i === sink ? `T(${i})` : `n${i}`
      return {
        kind: 'graphNode' as const,
        id: `n-${i}`,
        label: lbl,
        color: states[i] || COLORS.default,
      }
    })
  }

  let maxFlow = 0
  let round = 0

  yield {
    objects: [...mkNodes({ [source]: COLORS.sorted, [sink]: COLORS.pivot }), ...allEdges],
    codeLine: 1,
    description: `初始化流网络：源点=${source}，汇点=${sink}。所有边流量=0`,
  }

  const INF = 999

  while (true) {
    const level: number[] = Array(n).fill(-1)
    const q: number[] = [source]
    level[source] = 0

    yield {
      objects: [...mkNodes({ [source]: COLORS.comparing }), ...allEdges],
      codeLine: 2,
      description: `=== 第 ${round + 1} 轮 === BFS 构建分层图`,
    }

    while (q.length > 0) {
      const u = q.shift()!
      for (let v = 0; v < n; v++) {
        if (level[v] === -1 && capacity[u][v] - flow[u][v] > 0) {
          level[v] = level[u] + 1
          q.push(v)

          yield {
            objects: [
              ...mkNodes({ [u]: COLORS.comparing, [v]: COLORS.highlight, ...Object.fromEntries(Array.from({ length: n }, (_, i) => level[i] !== -1 ? [i, COLORS.sorted] : [i, null]).filter(([, c]) => c) as [number, string][]) }),
              ...allEdges.map((e, i) => i === getEdgeId(u, v) ? { ...e, color: COLORS.highlight } : e),
            ],
            codeLine: 3,
            description: `BFS：${u}(L${level[u]}) → ${v}(L${level[v]})，剩余容量=${capacity[u][v] - flow[u][v]}`,
          }
        }
      }
    }

    if (level[sink] === -1) {
      yield {
        objects: [...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.inactive]))), ...allEdges],
        codeLine: 4,
        description: '汇点不可达，分层图构建失败，算法终止',
      }
      break
    }

    yield {
      objects: [
        ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => level[i] !== -1 ? [i, COLORS.sorted] : [i, COLORS.inactive]))),
        ...allEdges,
      ],
      codeLine: 5,
      description: `分层图完成，汇点 level=${level[sink]}。进入 DFS 增广`,
    }

    const ptr: number[] = Array(n).fill(0)

    function* dfs(u: number, pushed: number): Generator<Scene, number> {
      if (u === sink) {
        maxFlow += pushed

        yield {
          objects: [
            ...mkNodes({ [sink]: COLORS.highlight }),
            ...allEdges,
          ],
          codeLine: 6,
          description: `增广 ${pushed} 单位流量到达汇点！总流量=${maxFlow}`,
        }
        return pushed
      }

      for (let v = ptr[u]; v < n; v++) {
        if (level[v] === level[u] + 1 && capacity[u][v] - flow[u][v] > 0) {
          const tr = Math.min(pushed, capacity[u][v] - flow[u][v])

          yield {
            objects: [
              ...mkNodes({ [u]: COLORS.comparing, [v]: COLORS.highlight }),
              ...allEdges.map((e, i) => i === getEdgeId(u, v) ? { ...e, color: COLORS.highlight } : e),
            ],
            codeLine: 7,
            description: `DFS：${u} → ${v}，可推进 ${tr}`,
          }

          const f = yield* dfs(v, tr)
          if (f > 0) {
            flow[u][v] += f
            flow[v][u] -= f

            yield {
              objects: [
                ...mkNodes({ [u]: COLORS.sorted, [v]: COLORS.sorted }),
                ...allEdges.map((e, i) => i === getEdgeId(u, v) ? { ...e, color: COLORS.sorted } : e),
              ],
              codeLine: 8,
              description: `更新流量：边(${u}→${v})+${f}，当前 flow/capacity=${flow[u][v]}/${capacity[u][v]}`,
            }
            return f
          }
        }
        ptr[u]++
      }
      return 0
    }

    let f: number
    let blockFlow = 0
    do {
      f = yield* dfs(source, INF)
      blockFlow += f
    } while (f > 0)

    if (blockFlow === 0) break
    round++
  }

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
      ...allEdges.map((e, i) => {
        const from = parseInt(e.from.slice(2)), to = parseInt(e.to.slice(2))
        return flow[from][to] > 0 ? { ...e, color: COLORS.sorted } : e
      }),
    ],
    codeLine: 9,
    description: `Dinic 完成！最大流 = ${maxFlow}`,
  }
}
