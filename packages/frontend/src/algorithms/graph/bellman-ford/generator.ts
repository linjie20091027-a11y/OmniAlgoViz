import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 5
  const INF = 999
  // 边列表: [from, to, weight]
  const edges: [number, number, number][] = [
    [0, 1, 6],
    [0, 2, 7],
    [1, 2, 8],
    [1, 3, 5],
    [1, 4, -4],
    [2, 3, -3],
    [2, 4, 9],
    [3, 1, -2],
    [4, 0, 2],
    [4, 3, 7],
  ]

  let dist: number[] = Array(size).fill(INF)
  const source = 0

  yield {
    description: '初始化：所有节点的距离设为无穷大，源节点是 0',
    codeLine: 1,
    objects: dist.map((_, i) => mkBar(`n${i}`, 0, i, '#6b7280', `节点${i}`)),
  }

  dist[source] = 0

  yield {
    description: '设置源节点 0 的距离为 0。将进行 V-1 = 4 轮松弛操作',
    codeLine: 2,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
        i === source ? '#ef4444' : '#6b7280', `节点${i}`)
    ),
  }

  // |V|-1 iterations
  for (let iter = 1; iter <= size - 1; iter++) {
    let relaxed = false

    yield {
      description: `=== 第 ${iter} 轮松弛 ===（共需 ${size - 1} 轮）`,
      codeLine: 3,
      objects: dist.map((d, i) =>
        mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
          i === source ? '#10b981' : d !== INF ? '#3b82f6' : '#6b7280', `节点${i}`)
      ),
    }

    for (const [u, v, w] of edges) {
      if (dist[u] !== INF && dist[u] + w < dist[v]) {
        const oldDist = dist[v]
        dist[v] = dist[u] + w
        relaxed = true

        yield {
          description: `第 ${iter} 轮，松弛边 (${u} → ${v})：权重 = ${w}，dist[${v}] 从 ${oldDist === INF ? 'INF' : oldDist} 更新为 ${dist[u]} + ${w} = ${dist[v]}`,
          codeLine: 4,
          objects: dist.map((d, i) =>
            mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
              i === v ? '#ef4444' : i === u ? '#f59e0b' : d !== INF ? '#3b82f6' : '#6b7280',
              i === v ? `节点${v}←${dist[v]}` : `节点${i}`)
          ),
        }
      } else if (dist[u] !== INF) {
        yield {
          description: `第 ${iter} 轮，边 (${u} → ${v})：dist[${v}] = ${dist[v] === INF ? 'INF' : dist[v]} ≥ ${dist[u]} + ${w}，不更新`,
          codeLine: 5,
          objects: dist.map((d, i) =>
            mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
              d !== INF ? '#3b82f6' : '#6b7280', `节点${i}`)
          ),
        }
      }
    }

    if (!relaxed) {
      yield {
        description: `第 ${iter} 轮无任何松弛发生，可提前终止`,
        codeLine: 6,
        objects: dist.map((d, i) =>
          mkBar(`n${i}`, d === INF ? 0 : d + 10, i, '#10b981', `节点${i}`)
        ),
      }
      break
    }
  }

  // Check for negative cycles
  yield {
    description: '进行第 V 轮额外检测，检查是否存在负权环',
    codeLine: 7,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 0 : d + 10, i, '#3b82f6', `节点${i}`)
    ),
  }

  let hasNegativeCycle = false
  for (const [u, v, w] of edges) {
    if (dist[u] !== INF && dist[u] + w < dist[v]) {
      hasNegativeCycle = true
      break
    }
  }

  yield {
    description: hasNegativeCycle
      ? '检测到负权环！图中存在负权环，无最短路径'
      : 'Bellman-Ford 算法完成！未检测到负权环，所有最短距离已求出',
    codeLine: 8,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
        hasNegativeCycle ? '#ef4444' : '#10b981',
        d === INF ? `节点${i}(不可达)` : `节点${i}(${d})`)
    ),
  }
}
