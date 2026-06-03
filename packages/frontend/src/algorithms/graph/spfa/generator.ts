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
    [[3, 5], [2, -3]],
    [[4, 3]],
    [[5, 2]],
    [[3, -2]],
    [],
  ]

  let dist: number[] = Array(size).fill(INF)
  let inQueue: boolean[] = Array(size).fill(false)
  let count: number[] = Array(size).fill(0)
  const queue: number[] = []
  const source = 0
  let hasNegativeCycle = false

  yield {
    description: '初始化：dist 全部设为 INF，inQueue 全部为 false。源节点为 0',
    codeLine: 1,
    objects: dist.map((_, i) =>
      mkBar(`n${i}`, 0, i, '#6b7280', `节点${i}`)
    ),
  }

  dist[source] = 0
  queue.push(source)
  inQueue[source] = true

  yield {
    description: '源节点 0 入队，dist[0] = 0，开始 SPFA 松弛',
    codeLine: 2,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
        i === source ? '#ef4444' : '#6b7280', `节点${i}`)
    ),
  }

  while (queue.length > 0 && !hasNegativeCycle) {
    const u = queue.shift()!
    inQueue[u] = false

    yield {
      description: `从队列头部取出节点 ${u}（dist = ${dist[u] === INF ? 'INF' : dist[u]}），当前队列：[${queue.join(', ') || '空'}]`,
      codeLine: 3,
      objects: dist.map((d, i) =>
        mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
          i === u ? '#ef4444' : inQueue[i] ? '#3b82f6' : d !== INF ? '#10b981' : '#6b7280',
          `节点${i}`)
      ),
    }

    for (const [v, w] of graph[u]) {
      if (dist[u] !== INF && dist[u] + w < dist[v]) {
        const oldDist = dist[v]
        dist[v] = dist[u] + w

        yield {
          description: `松弛边 (${u} → ${v}) 权重 ${w}：dist[${v}] 从 ${oldDist === INF ? 'INF' : oldDist} 更新为 ${dist[u]} + ${w} = ${dist[v]}`,
          codeLine: 4,
          objects: dist.map((d, i) =>
            mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
              i === v ? '#10b981' : i === u ? '#ef4444' : d !== INF ? '#3b82f6' : '#6b7280',
              `节点${i}`)
          ),
        }

        if (!inQueue[v]) {
          queue.push(v)
          inQueue[v] = true
          count[v]++

          yield {
            description: `节点 ${v} 不在队列中，加入队列 → [${queue.join(', ')}]（入队次数：${count[v]}）`,
            codeLine: 5,
            objects: dist.map((d, i) =>
              mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
                i === v ? '#f59e0b' : inQueue[i] ? '#3b82f6' : d !== INF ? '#10b981' : '#6b7280',
                `节点${i}`)
            ),
          }

          if (count[v] >= size) {
            hasNegativeCycle = true

            yield {
              description: `节点 ${v} 入队次数 ${count[v]} ≥ ${size}，检测到负权环！`,
              codeLine: 6,
              objects: dist.map((d, i) =>
                mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
                  '#ef4444', `节点${i}`)
              ),
            }
            break
          }
        }
      }
    }
  }

  yield {
    description: hasNegativeCycle
      ? 'SPFA 终止：图中存在负权环，不存在最短路径！'
      : 'SPFA 算法完成！所有节点的最短距离已求出',
    codeLine: 7,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 0 : d + 10, i,
        hasNegativeCycle ? '#ef4444' : '#10b981',
        d === INF ? `节点${i}(不可达)` : `节点${i}(${d})`)
    ),
  }
}
