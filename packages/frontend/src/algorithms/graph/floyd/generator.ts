import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 4
  const INF = 99
  // 初始邻接矩阵
  const initDist: number[][] = [
    [0, 3, INF, 7],
    [8, 0, 2, INF],
    [5, INF, 0, 1],
    [2, INF, INF, 0],
  ]

  let dist = initDist.map(row => [...row])

  yield {
    description: '初始化距离矩阵 D。D[i][j] = 直接边的权重，无直接边则为 INF，D[i][i] = 0',
    codeLine: 1,
    objects: dist[0].map((_, i) =>
      mkBar(`d0${i}`, dist[0][i] === INF ? 0 : dist[0][i] * 5, i, '#3b82f6', `D[0][${i}]`)
    ),
  }

  yield {
    description: '当前展示第 0 行（节点 0 到各节点的距离）。将依次以每个节点为中间节点优化',
    codeLine: 2,
    objects: dist[0].map((_, i) =>
      mkBar(`d0${i}`, dist[0][i] === INF ? 0 : dist[0][i] * 5, i, '#6b7280', `D[0][${i}]`)
    ),
  }

  for (let k = 0; k < size; k++) {
    yield {
      description: `=== 考虑中间节点 ${k} === 尝试通过节点 ${k} 松弛所有点对 (i, j)`,
      codeLine: 3,
      objects: dist[0].map((_, i) =>
        mkBar(`d0${i}`, dist[0][i] === INF ? 0 : dist[0][i] * 5, i, '#f59e0b', `D[0][${i}]`)
      ),
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (dist[i][k] !== INF && dist[k][j] !== INF && dist[i][k] + dist[k][j] < dist[i][j]) {
          const oldVal = dist[i][j]
          dist[i][j] = dist[i][k] + dist[k][j]

          yield {
            description: `松弛 (${i}, ${j})：经 k=${k}，D[${i}][${j}] 从 ${oldVal === INF ? 'INF' : oldVal} 更新为 D[${i}][${k}] + D[${k}][${j}] = ${dist[i][k]} + ${dist[k][j]} = ${dist[i][j]}`,
            codeLine: 4,
            objects: dist[0].map((_, idx) =>
              mkBar(`d0${idx}`, dist[0][idx] === INF ? 0 : dist[0][idx] * 5, idx,
                idx === 0 && i === 0 && idx === j ? '#ef4444' : '#3b82f6',
                i === 0 && idx === j ? `[0][${j}]←${dist[0][j]}` : `D[0][${idx}]`)
            ),
          }
        }
      }
    }

    yield {
      description: `节点 ${k} 作为中间节点处理完毕。展示当前 D 矩阵第 0 行`,
      codeLine: 5,
      objects: dist[0].map((_, i) =>
        mkBar(`d0${i}`, dist[0][i] === INF ? 0 : dist[0][i] * 5, i, '#10b981', `D[0][${i}]`)
      ),
    }
  }

  yield {
    description: 'Floyd-Warshall 算法完成！D 矩阵包含所有节点对之间的最短路径长度',
    codeLine: 6,
    objects: dist[0].map((v, i) =>
      mkBar(`d0${i}`, v * 5, i, '#10b981', `节点0→节点${i}: ${v}`)
    ),
  }
}
