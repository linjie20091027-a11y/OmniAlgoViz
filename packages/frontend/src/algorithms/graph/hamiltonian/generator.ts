import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 5
  // 无向图邻接表（存在哈密顿路径）
  const graph: number[][] = [
    [1, 2, 3],
    [0, 2, 4],
    [0, 1, 3],
    [0, 2, 4],
    [1, 3],
  ]

  let visited: boolean[] = Array(size).fill(false)
  let path: number[] = []
  let found = false

  yield {
    description: '初始化：visited 全部为 false。哈密顿路径要求访问每个节点恰好一次',
    codeLine: 1,
    objects: Array.from({ length: size }, (_, i) =>
      mkBar(`n${i}`, 0, i, '#6b7280', `节点${i}`)
    ),
  }

  function* hamiltonian(u: number, depth: number): Generator<Scene, boolean> {
    visited[u] = true
    path.push(u)

    yield {
      description: `访问节点 ${u}（深度 = ${depth}），当前路径：[${path.join(' → ')}]，已访问 ${path.length}/${size} 个节点`,
      codeLine: 2,
      objects: Array.from({ length: size }, (_, i) =>
        mkBar(`n${i}`, visited[i] ? path.indexOf(i) + 1 : 0, i,
          i === u ? '#ef4444' : visited[i] ? '#10b981' : '#6b7280',
          visited[i] ? `节点${i}(✓${path.indexOf(i) + 1})` : `节点${i}`)
      ),
    }

    if (path.length === size) {
      yield {
        description: `找到哈密顿路径！路径：[${path.join(' → ')}]（所有 ${size} 个节点均访问）`,
        codeLine: 3,
        objects: Array.from({ length: size }, (_, i) =>
          mkBar(`n${i}`, path.indexOf(i) + 1, i, '#10b981',
            `节点${i}(第${path.indexOf(i) + 1}步)`)
        ),
      }
      return true
    }

    for (const v of graph[u]) {
      if (!visited[v]) {
        yield {
          description: `从节点 ${u} 尝试访问邻居节点 ${v}（深度 = ${depth + 1}）`,
          codeLine: 4,
          objects: Array.from({ length: size }, (_, i) =>
            mkBar(`n${i}`, visited[i] ? path.indexOf(i) + 1 : 0, i,
              i === v ? '#f59e0b' : i === u ? '#ef4444' : visited[i] ? '#10b981' : '#6b7280',
              `节点${i}`)
          ),
        }

        if (yield* hamiltonian(v, depth + 1)) {
          return true
        }

        yield {
          description: `从节点 ${v} 回溯到节点 ${u}（此路不通），撤销访问状态`,
          codeLine: 5,
          objects: Array.from({ length: size }, (_, i) =>
            mkBar(`n${i}`, visited[i] ? path.indexOf(i) + 1 : 0, i,
              i === u ? '#ef4444' : i === v ? '#6b7280' : visited[i] ? '#10b981' : '#6b7280',
              `节点${i}`)
          ),
        }
      } else {
        yield {
          description: `节点 ${v} 已在路径中（位置 = ${path.indexOf(v)}），跳过`,
          codeLine: 6,
          objects: Array.from({ length: size }, (_, i) =>
            mkBar(`n${i}`, visited[i] ? path.indexOf(i) + 1 : 0, i,
              i === v ? '#f59e0b' : visited[i] ? '#10b981' : '#6b7280',
              `节点${i}`)
          ),
        }
      }
    }

    // 回溯
    visited[u] = false
    path.pop()

    yield {
      description: `节点 ${u} 的所有邻居均尝试完毕，回溯。当前路径：[${path.join(' → ') || '空'}]`,
      codeLine: 7,
      objects: Array.from({ length: size }, (_, i) =>
        mkBar(`n${i}`, visited[i] ? path.indexOf(i) + 1 : 0, i,
          visited[i] ? '#10b981' : '#6b7280',
          `节点${i}`)
      ),
    }
    return false
  }

  for (let start = 0; start < size && !found; start++) {
    visited = Array(size).fill(false)
    path = []

    yield {
      description: `尝试从节点 ${start} 开始寻找哈密顿路径`,
      codeLine: 8,
      objects: Array.from({ length: size }, (_, i) =>
        mkBar(`n${i}`, 0, i,
          i === start ? '#f59e0b' : '#6b7280', `节点${i}`)
      ),
    }

    found = yield* hamiltonian(start, 1)
  }

  yield {
    description: found
      ? `搜索完成！找到哈密顿路径：[${path.join(' → ')}]`
      : '搜索完成！该图不存在哈密顿路径',
    codeLine: 9,
    objects: Array.from({ length: size }, (_, i) =>
      mkBar(`n${i}`, found ? path.indexOf(i) + 1 : 0, i,
        found ? '#10b981' : '#ef4444',
        found ? `节点${i}(第${path.indexOf(i) + 1}步)` : `节点${i}`)
    ),
  }
}
