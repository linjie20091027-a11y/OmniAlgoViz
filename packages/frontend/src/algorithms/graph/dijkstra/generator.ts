import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 6
  const INF = 999
  // 加权有向图邻接表: [target, weight]
  const graph: [number, number][][] = [
    [[1, 4], [2, 2]],
    [[3, 5], [2, 1]],
    [[4, 3]],
    [[5, 2]],
    [[3, 1], [5, 6]],
    [],
  ]

  let dist: number[] = Array(size).fill(INF)
  let visited: boolean[] = Array(size).fill(false)
  const source = 0

  yield {
    description: '初始化：dist 数组全部设为无穷大，visited 全部为 false。源节点为 0',
    codeLine: 1,
    objects: dist.map((): BarObject => mkBar('init', 0, 0, '#6b7280', 'INF')).concat(
      ...dist.map((_, i) => mkBar(`n${i}`, 0, i, '#6b7280', `节点${i}`))
    ),
  }

  dist[source] = 0

  yield {
    description: '设置源节点 0 的距离为 0，开始 Dijkstra 算法',
    codeLine: 2,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 20 : d * 3 + 1, i,
        i === source ? '#ef4444' : '#6b7280', `节点${i}`)
    ),
  }

  for (let iter = 0; iter < size; iter++) {
    // Find unvisited node with minimum distance
    let u = -1
    let minDist = INF
    for (let i = 0; i < size; i++) {
      if (!visited[i] && dist[i] < minDist) {
        u = i
        minDist = dist[i]
      }
    }

    if (u === -1 || minDist === INF) break

    yield {
      description: `寻找未访问节点中距离最小的：节点 ${u}（dist = ${minDist}）被选中`,
      codeLine: 3,
      objects: dist.map((d, i) =>
        mkBar(`n${i}`, d === INF ? 20 : d * 3 + 1, i,
          i === u ? '#f59e0b' : visited[i] ? '#10b981' : '#3b82f6', `节点${i}`)
      ),
    }

    visited[u] = true

    yield {
      description: `将节点 ${u} 标记为已访问，已确定其最短路径`,
      codeLine: 4,
      objects: dist.map((d, i) =>
        mkBar(`n${i}`, d === INF ? 20 : d * 3 + 1, i,
          i === u ? '#10b981' : visited[i] ? '#10b981' : '#3b82f6', `节点${i}`)
      ),
    }

    for (const [v, w] of graph[u]) {
      if (!visited[v] && dist[u] + w < dist[v]) {
        const oldDist = dist[v]
        dist[v] = dist[u] + w

        yield {
          description: `松弛边 (${u} → ${v})：dist[${v}] 从 ${oldDist === INF ? 'INF' : oldDist} 更新为 ${dist[v]}（通过节点 ${u}，距离 ${dist[u]} + ${w}）`,
          codeLine: 5,
          objects: dist.map((d, i) =>
            mkBar(`n${i}`, d === INF ? 20 : d * 3 + 1, i,
              i === v ? '#ef4444' : visited[i] ? '#10b981' : '#3b82f6',
              `节点${i}`)
          ),
        }
      } else if (!visited[v]) {
        yield {
          description: `检查边 (${u} → ${v})：当前距离 ${dist[v]} 不大于 ${dist[u] + w}，无需更新`,
          codeLine: 6,
          objects: dist.map((d, i) =>
            mkBar(`n${i}`, d === INF ? 20 : d * 3 + 1, i,
              visited[i] ? '#10b981' : '#3b82f6', `节点${i}`)
          ),
        }
      }
    }
  }

  yield {
    description: '所有节点均已处理，Dijkstra 算法完成！各节点最短距离已求出',
    codeLine: 7,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 0 : d * 3 + 1, i, '#10b981', `节点${i}(${d})`)
    ),
  }
}
