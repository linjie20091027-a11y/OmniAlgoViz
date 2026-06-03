import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* bipartiteCheckGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 10)
  const adj: number[][] = Array.from({ length: n }, () => [])

  for (let i = 1; i < n; i++) {
    const parent = Math.floor(Math.random() * i)
    adj[parent].push(i)
    adj[i].push(parent)
  }
  for (let i = 0; i < Math.floor(n * 1.3); i++) {
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

  const RED = '#ef4444'
  const BLUE = '#3b82f6'
  const colorArr: number[] = Array(n).fill(-1)
  let isBipartite = true

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => {
      let nodeColor = COLORS.default
      if (colorArr[i] === 0) nodeColor = RED
      else if (colorArr[i] === 1) nodeColor = BLUE
      if (states[i]) nodeColor = states[i]
      const cLabel = colorArr[i] === 0 ? '红' : colorArr[i] === 1 ? '蓝' : '未'
      return {
        kind: 'graphNode' as const,
        id: `n-${i}`,
        label: `${i}(${cLabel})`,
        color: nodeColor,
      }
    })
  }

  yield {
    objects: [...mkNodes({}), ...allEdges],
    codeLine: 1,
    description: `初始化：${n} 个节点均未染色。通过 BFS 逐层染色判断二分图`,
  }

  for (let start = 0; start < n && isBipartite; start++) {
    if (colorArr[start] !== -1) continue

    const queue: number[] = [start]
    colorArr[start] = 0

    yield {
      objects: [
        ...mkNodes({ [start]: COLORS.highlight }),
        ...allEdges,
      ],
      codeLine: 2,
      description: `从节点 ${start} 开始新连通分量，染为红色（0）`,
    }

    while (queue.length > 0 && isBipartite) {
      const u = queue.shift()!

      yield {
        objects: [
          ...mkNodes({ [u]: COLORS.comparing }),
          ...allEdges.map(e => {
            const from = parseInt(e.from.slice(2)), to = parseInt(e.to.slice(2))
            return (from === u || to === u) ? { ...e, color: COLORS.comparing } : e
          }),
        ],
        codeLine: 3,
        description: `从队列取出节点 ${u}（${colorArr[u] === 0 ? '红色' : '蓝色'}），检查邻居`,
      }

      for (const v of adj[u]) {
        if (colorArr[v] === -1) {
          colorArr[v] = 1 - colorArr[u]
          queue.push(v)

          yield {
            objects: [
              ...mkNodes({ [u]: COLORS.comparing, [v]: COLORS.highlight }),
              ...allEdges.map(e =>
                (e.from === `n-${u}` && e.to === `n-${v}`) || (e.from === `n-${v}` && e.to === `n-${u}`)
                  ? { ...e, color: COLORS.highlight }
                  : e
              ),
            ],
            codeLine: 4,
            description: `邻居 ${v} 未染色，染为${colorArr[v] === 0 ? '红色' : '蓝色'}，加入队列`,
          }
        } else if (colorArr[v] === colorArr[u]) {
          isBipartite = false

          yield {
            objects: [
              ...mkNodes({ [u]: COLORS.swapping, [v]: COLORS.swapping }),
              ...allEdges.map(e =>
                (e.from === `n-${u}` && e.to === `n-${v}`) || (e.from === `n-${v}` && e.to === `n-${u}`)
                  ? { ...e, color: COLORS.swapping }
                  : e
              ),
            ],
            codeLine: 5,
            description: `冲突！${u} 和 ${v} 同色相邻，不是二分图！`,
          }
          break
        } else {
          yield {
            objects: [
              ...mkNodes({ [u]: COLORS.comparing, [v]: COLORS.sorted }),
              ...allEdges,
            ],
            codeLine: 6,
            description: `邻居 ${v} 已染色且颜色不同，跳过`,
          }
        }
      }
    }
    if (!isBipartite) break
  }

  yield {
    objects: [
      ...mkNodes({}),
      ...allEdges.map(e => {
        const from = parseInt(e.from.slice(2)), to = parseInt(e.to.slice(2))
        return colorArr[from] !== colorArr[to] && colorArr[from] !== -1 && colorArr[to] !== -1
          ? { ...e, color: COLORS.sorted }
          : isBipartite ? { ...e, color: COLORS.inactive } : { ...e, color: COLORS.swapping }
      }),
    ],
    codeLine: 7,
    description: isBipartite
      ? '判定完成：该图是二分图！红色组和蓝色组各节点不相邻'
      : '判定完成：该图不是二分图！',
  }
}
