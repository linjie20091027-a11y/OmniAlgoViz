import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 6
  const INF = 999
  // 容量图: adjacency matrix
  let capacity: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  let flow: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  // 边: from, to, cap
  const edges: [number, number, number][] = [
    [0, 1, 16], [0, 2, 13],
    [1, 2, 10], [1, 3, 12],
    [2, 1, 4], [2, 4, 14],
    [3, 2, 9], [3, 5, 20],
    [4, 3, 7], [4, 5, 4],
  ]
  for (const [u, v, c] of edges) capacity[u][v] = c

  const source = 0
  const sink = 5

  yield {
    description: '初始化流网络：源点 = 0，汇点 = 5。所有边的流量初始为 0',
    codeLine: 1,
    objects: Array.from({ length: size }, (_, i) =>
      mkBar(`n${i}`, 0, i, '#6b7280', `节点${i}`)
    ),
  }

  let maxFlow = 0
  let round = 0

  while (true) {
    // BFS 构建分层图
    const level: number[] = Array(size).fill(-1)
    const q: number[] = [source]
    level[source] = 0

    yield {
      description: `=== 第 ${round + 1} 轮 === 通过 BFS 构建分层图（level graph）`,
      codeLine: 2,
      objects: level.map((_, i) =>
        mkBar(`n${i}`, i === source ? 1 : 0, i,
          i === source ? '#ef4444' : '#6b7280', `节点${i}`)
      ),
    }

    while (q.length > 0) {
      const u = q.shift()!
      for (let v = 0; v < size; v++) {
        if (level[v] === -1 && capacity[u][v] - flow[u][v] > 0) {
          level[v] = level[u] + 1
          q.push(v)

          yield {
            description: `BFS：从节点 ${u}（level=${level[u]}）发现节点 ${v}（level=${level[u] + 1}），存在剩余容量 ${capacity[u][v] - flow[u][v]}`,
            codeLine: 3,
            objects: level.map((_, i) =>
              mkBar(`n${i}`, level[i] === -1 ? 0 : level[i] + 1, i,
                i === v ? '#10b981' : level[i] !== -1 ? '#3b82f6' : '#6b7280',
                `节点${i}`)
            ),
          }
        }
      }
    }

    if (level[sink] === -1) {
      yield {
        description: '汇点 5 不可达（level = -1），分层图构建失败，算法终止',
        codeLine: 4,
        objects: level.map((_, i) =>
          mkBar(`n${i}`, level[i] === -1 ? 0 : level[i] + 1, i,
            '#6b7280', `节点${i}`)
        ),
      }
      break
    }

    yield {
      description: `分层图构建完成。汇点 5 的 level = ${level[sink]}，进入 DFS 增广阶段`,
      codeLine: 5,
      objects: level.map((_, i) =>
        mkBar(`n${i}`, level[i] === -1 ? 0 : level[i] + 1, i,
          '#3b82f6', `节点${i}(L${level[i]})`)
      ),
    }

    // DFS 阻塞流
    const ptr: number[] = Array(size).fill(0)
    let blockFlow = 0

    function* dfs(u: number, pushed: number): Generator<Scene, number> {
      if (u === sink) {
        blockFlow += pushed
        maxFlow += pushed

        yield {
          description: `增广成功！到达汇点，推进 ${pushed} 单位流量。当前总流量 = ${maxFlow}`,
          codeLine: 6,
          objects: Array.from({ length: size }, (_, i) => {
            const outFlow = flow[i].reduce((a, b) => a + b, 0)
            return mkBar(`n${i}`, outFlow, i,
              i === source || i === sink ? '#10b981' : '#3b82f6',
              `节点${i}`)
          }),
        }
        return pushed
      }

      for (let v = ptr[u]; v < size; v++) {
        if (level[v] === level[u] + 1 && capacity[u][v] - flow[u][v] > 0) {
          const tr = Math.min(pushed, capacity[u][v] - flow[u][v])

          yield {
            description: `DFS 增广：从节点 ${u} 到节点 ${v}，可推进 ${tr} 单位`,
            codeLine: 7,
            objects: Array.from({ length: size }, (_, i) => {
              const outFlow = flow[i].reduce((a, b) => a + b, 0)
              return mkBar(`n${i}`, outFlow, i,
                i === u || i === v ? '#f59e0b' : '#3b82f6', `节点${i}`)
            }),
          }

          const f = yield* dfs(v, tr)

          if (f > 0) {
            flow[u][v] += f
            flow[v][u] -= f

            yield {
              description: `更新流量：边 (${u} → ${v}) 增加 ${f}，反向边 (${v} → ${u}) 减少 ${f}`,
              codeLine: 8,
              objects: Array.from({ length: size }, (_, i) => {
                const outFlow = flow[i].reduce((a, b) => a + b, 0)
                return mkBar(`n${i}`, outFlow, i,
                  i === u || i === v ? '#10b981' : '#3b82f6', `节点${i}`)
              }),
            }
            return f
          }
        }
        ptr[u]++
      }

      return 0
    }

    let f: number
    do {
      f = yield* dfs(source, INF)
    } while (f > 0)

    if (blockFlow === 0) break
    round++
  }

  yield {
    description: `Dinic 最大流算法完成！最大流 = ${maxFlow}`,
    codeLine: 9,
    objects: Array.from({ length: size }, (_, i) => {
      const outFlow = flow[i].reduce((a, b) => a + b, 0)
      return mkBar(`n${i}`, outFlow, i, '#10b981',
        i === source ? `源点(${outFlow})` : i === sink ? `汇点(-${-outFlow})` : `节点${i}`)
    }),
  }
}
