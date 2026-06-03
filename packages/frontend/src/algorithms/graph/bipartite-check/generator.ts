import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 6
  // 无向图邻接表（二分图示例）
  const graph: number[][] = [
    [3, 4],
    [3, 5],
    [4],
    [0, 1],
    [0, 2, 5],
    [1, 4],
  ]

  let color: number[] = Array(size).fill(-1) // -1 未染色, 0 红色, 1 蓝色
  let isBipartite = true

  yield {
    description: '初始化：所有节点的颜色置为 -1（未染色）。将通过 BFS 逐层染色判断是否为二分图',
    codeLine: 1,
    objects: color.map((_, i) =>
      mkBar(`n${i}`, 0, i, '#6b7280', `节点${i} `)
    ),
  }

  for (let start = 0; start < size && isBipartite; start++) {
    if (color[start] !== -1) continue

    const queue: number[] = [start]
    color[start] = 0

    yield {
      description: `从节点 ${start} 开始新的连通分量，染色为 红色（0）`,
      codeLine: 2,
      objects: color.map((c, i) =>
        mkBar(`n${i}`, c === -1 ? 0 : c + 1, i,
          i === start ? '#ef4444' : c !== -1 ? '#3b82f6' : '#6b7280',
          `节点${i}`)
      ),
    }

    while (queue.length > 0) {
      const u = queue.shift()!

      yield {
        description: `从队列取出节点 ${u}（颜色 = ${color[u] === 0 ? '红色' : '蓝色'}），检查其所有邻居`,
        codeLine: 3,
        objects: color.map((c, i) =>
          mkBar(`n${i}`, c === -1 ? 0 : c + 1, i,
            i === u ? '#f59e0b' : c === 0 ? '#ef4444' : c === 1 ? '#3b82f6' : '#6b7280',
            c === 0 ? `节点${i}(红)` : c === 1 ? `节点${i}(蓝)` : `节点${i}`)
        ),
      }

      for (const v of graph[u]) {
        if (color[v] === -1) {
          color[v] = 1 - color[u] // 染相反颜色
          queue.push(v)

          yield {
            description: `邻居节点 ${v} 未染色，染为 ${color[v] === 0 ? '红色' : '蓝色'}（与节点 ${u} 相反），加入队列 → [${queue.join(', ')}]`,
            codeLine: 4,
            objects: color.map((c, i) =>
              mkBar(`n${i}`, c === -1 ? 0 : c + 1, i,
                i === v ? '#10b981' : i === u ? '#f59e0b' : c === 0 ? '#ef4444' : c === 1 ? '#3b82f6' : '#6b7280',
                `节点${i}`)
            ),
          }
        } else if (color[v] === color[u]) {
          isBipartite = false
          yield {
            description: `冲突！节点 ${u}（颜色 = ${color[u] === 0 ? '红' : '蓝'}）和节点 ${v}（颜色 = ${color[v] === 0 ? '红' : '蓝'}）相邻却同色，不是二分图！`,
            codeLine: 5,
            objects: color.map((c, i) =>
              mkBar(`n${i}`, c === -1 ? 0 : c + 1, i,
                i === u || i === v ? '#ef4444' : c === 0 ? '#ef4444' : c === 1 ? '#3b82f6' : '#6b7280',
                `节点${i}`)
            ),
          }
          break
        } else {
          yield {
            description: `节点 ${v} 已染色且颜色不同（正常），跳过`,
            codeLine: 6,
            objects: color.map((c, i) =>
              mkBar(`n${i}`, c === -1 ? 0 : c + 1, i,
                i === v ? '#f59e0b' : c === 0 ? '#ef4444' : c === 1 ? '#3b82f6' : '#6b7280',
                `节点${i}`)
            ),
          }
        }
      }
      if (!isBipartite) break
    }
    if (!isBipartite) break
  }

  yield {
    description: isBipartite
      ? '判定完成：该图是二分图！红色节点为一组，蓝色节点为另一组'
      : '判定完成：该图不是二分图！存在同色相邻的冲突',
    codeLine: 7,
    objects: color.map((c, i) =>
      mkBar(`n${i}`, c === -1 ? 0 : c + 1, i,
        isBipartite ? '#10b981' : '#ef4444',
        c === 0 ? `节点${i}(红)` : c === 1 ? `节点${i}(蓝)` : `节点${i}`)
    ),
  }
}
