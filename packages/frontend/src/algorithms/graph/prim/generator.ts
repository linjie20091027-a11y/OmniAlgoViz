import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 6
  const INF = 999
  // 加权无向图邻接表: [target, weight]
  const graph: [number, number][][] = [
    [[1, 4], [2, 3]],
    [[0, 4], [2, 1], [3, 2]],
    [[0, 3], [1, 1], [3, 4], [4, 3]],
    [[1, 2], [2, 4], [4, 2], [5, 1]],
    [[2, 3], [3, 2], [5, 6]],
    [[3, 1], [4, 6]],
  ]

  let dist: number[] = Array(size).fill(INF)
  let visited: boolean[] = Array(size).fill(false)
  let parent: number[] = Array(size).fill(-1)

  yield {
    description: '初始化：dist 数组全部设为 INF，visited 全部为 false。任选节点 0 作为起始点',
    codeLine: 1,
    objects: dist.map((_, i) => mkBar(`n${i}`, 0, i, '#6b7280', `节点${i}`)),
  }

  dist[0] = 0

  yield {
    description: '设置起始节点 0 的 key 值为 0，开始构建 MST',
    codeLine: 2,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 0 : d * 3 + 1, i,
        i === 0 ? '#ef4444' : '#6b7280', `节点${i}`)
    ),
  }

  for (let iter = 0; iter < size; iter++) {
    // Find unvisited node with minimum key
    let u = -1
    let minKey = INF
    for (let i = 0; i < size; i++) {
      if (!visited[i] && dist[i] < minKey) {
        u = i
        minKey = dist[i]
      }
    }

    if (u === -1) break

    yield {
      description: `从未访问节点中选择 key 最小的：节点 ${u}（key = ${minKey}）`,
      codeLine: 3,
      objects: dist.map((d, i) =>
        mkBar(`n${i}`, d === INF ? 0 : d * 3 + 1, i,
          i === u ? '#f59e0b' : visited[i] ? '#10b981' : '#3b82f6',
          `节点${i}`)
      ),
    }

    visited[u] = true

    const p = parent[u]
    const action = p === -1 ? '作为 MST 起点加入' : `将边 (${p}, ${u}) 权重 ${dist[u]} 加入 MST`

    yield {
      description: `将节点 ${u} ${action}，标记为已访问`,
      codeLine: 4,
      objects: dist.map((d, i) =>
        mkBar(`n${i}`, d === INF ? 0 : d * 3 + 1, i,
          visited[i] ? '#10b981' : '#3b82f6',
          `节点${i}`)
      ),
    }

    for (const [v, w] of graph[u]) {
      if (!visited[v] && w < dist[v]) {
        const oldDist = dist[v]
        dist[v] = w
        parent[v] = u

        yield {
          description: `更新节点 ${v} 的 key：从 ${oldDist === INF ? 'INF' : oldDist} 降为 ${w}（发现更短的边 (${u}, ${v})），设置 parent[${v}] = ${u}`,
          codeLine: 5,
          objects: dist.map((d, i) =>
            mkBar(`n${i}`, d === INF ? 0 : d * 3 + 1, i,
              i === v ? '#ef4444' : visited[i] ? '#10b981' : '#3b82f6',
              `节点${i}`)
          ),
        }
      }
    }
  }

  yield {
    description: 'Prim 算法完成！MST 构建完毕，所有节点已加入最小生成树',
    codeLine: 6,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 0 : d * 3 + 1, i, '#10b981',
        `节点${i}`)
    ),
  }
}
