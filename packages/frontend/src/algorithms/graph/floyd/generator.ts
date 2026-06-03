import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* floydGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 6)
  const INF = 99

  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(INF))
  const edgeSet = new Set<string>()
  const allEdges: GraphEdgeObject[] = []

  for (let i = 0; i < n; i++) dist[i][i] = 0

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < 0.6 || j === i + 1) {
        const w = Math.floor(Math.random() * 9) + 1
        dist[i][j] = w
        dist[j][i] = w
        edgeSet.add(`${i}-${j}`)
        allEdges.push({
          kind: 'graphEdge', id: `e-${i}-${j}`, from: `n-${i}`, to: `n-${j}`,
          weight: w, directed: false, color: '#cbd5e1',
        })
      }
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && !edgeSet.has(`${i}-${j}`) && !edgeSet.has(`${j}-${i}`) && Math.random() < 0.3) {
        const w = Math.floor(Math.random() * 9) + 1
        dist[i][j] = w
        allEdges.push({
          kind: 'graphEdge', id: `e-${i}-${j}`, from: `n-${i}`, to: `n-${j}`,
          weight: w, directed: true, color: '#cbd5e1',
        })
      }
    }
  }

  function mkNodes(k: number, states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => ({
      kind: 'graphNode' as const,
      id: `n-${i}`,
      label: dist[k][i] === INF ? `${i}(∞)` : `${i}(${dist[k][i]})`,
      color: states[i] || COLORS.default,
    }))
  }

  yield {
    objects: [...mkNodes(0, {}), ...allEdges],
    codeLine: 1,
    description: `初始距离矩阵：${n} 个节点，直接边的权重已设置，无直接边为 INF`,
  }

  for (let k = 0; k < n; k++) {
    yield {
      objects: [
        ...mkNodes(0, { [k]: COLORS.pivot }),
        ...allEdges.map(e => {
          const from = parseInt(e.from.slice(2)), to = parseInt(e.to.slice(2))
          return (from === k || to === k) ? { ...e, color: COLORS.pivot } : e
        }),
      ],
      codeLine: 2,
      description: `=== 考虑中间节点 ${k} === 尝试通过节点 ${k} 松弛所有点对`,
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] === INF || dist[k][j] === INF) continue
        const newDist = dist[i][k] + dist[k][j]

        if (newDist < dist[i][j]) {
          const oldVal = dist[i][j]
          dist[i][j] = newDist

          yield {
            objects: [
              ...mkNodes(0, { [i]: COLORS.comparing, [j]: COLORS.highlight, [k]: COLORS.pivot }),
              ...allEdges.map(e => {
                const f = parseInt(e.from.slice(2)), t = parseInt(e.to.slice(2))
                return ((f === i && t === j) || (f === i && t === k) || (f === k && t === j))
                  ? { ...e, color: COLORS.highlight }
                  : e
              }),
            ],
            codeLine: 3,
            description: `松弛 (${i},${j})：经 k=${k}，${oldVal === INF ? '∞' : oldVal} → ${newDist}（${dist[i][k]}+${dist[k][j]}）`,
          }
        }
      }
    }

    yield {
      objects: [...mkNodes(0, Object.fromEntries(Array.from({ length: k + 1 }, (_, i) => [i, COLORS.sorted]))), ...allEdges],
      codeLine: 4,
      description: `节点 ${k} 中间处理完毕`,
    }
  }

  yield {
    objects: [
      ...mkNodes(0, Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
      ...allEdges,
    ],
    codeLine: 5,
    description: `Floyd-Warshall 完成！所有点对最短路径已求出`,
  }
}
