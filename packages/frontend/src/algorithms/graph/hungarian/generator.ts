import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  // 二分图左右各 4 个节点
  const leftSize = 4
  const rightSize = 4
  const adj: number[][] = [
    [0, 1],
    [0, 2],
    [1],
    [2, 3],
  ]

  let matchL: number[] = Array(leftSize).fill(-1)  // 左->右匹配
  let matchR: number[] = Array(rightSize).fill(-1)  // 右->左匹配
  let totalMatch = 0

  yield {
    description: '初始化：左部 4 个节点，右部 4 个节点。matchL 和 matchR 全部置为 -1（未匹配）',
    codeLine: 1,
    objects: matchL.map((_, i) =>
      mkBar(`L${i}`, 0, i, '#6b7280', `左${i}`)
    ).concat(
      matchR.map((_, i) =>
        mkBar(`R${i}`, 0, i + leftSize, '#9ca3af', `右${i}`)
      )
    ),
  }

  function* dfs(u: number, visited: boolean[]): Generator<Scene, boolean> {
    for (const v of adj[u]) {
      if (visited[v]) continue
      visited[v] = true

      yield {
        description: `尝试为左部节点 ${u} 匹配右部节点 ${v}（标记 ${v} 为已访问）`,
        codeLine: 2,
        objects: matchL.map((m, i) =>
          mkBar(`L${i}`, m === -1 ? 0 : m + 1, i,
            i === u ? '#ef4444' : m !== -1 ? '#10b981' : '#6b7280',
            m === -1 ? `左${i}` : `左${i}→右${m}`)
        ).concat(
          matchR.map((m, i) =>
            mkBar(`R${i}`, m === -1 ? 0 : m + 1, i + leftSize,
              i === v ? '#f59e0b' : '#9ca3af',
              m === -1 ? `右${i}` : `右${i}←左${m}`)
          )
        ),
      }

      if (matchR[v] === -1) {
        matchL[u] = v
        matchR[v] = u

        yield {
          description: `右部节点 ${v} 尚未匹配！直接匹配：左${u} ↔ 右${v}`,
          codeLine: 3,
          objects: matchL.map((m, i) =>
            mkBar(`L${i}`, m === -1 ? 0 : m + 1, i,
              m !== -1 ? '#10b981' : '#6b7280',
              m === -1 ? `左${i}` : `左${i}→右${m}`)
          ).concat(
            matchR.map((m, i) =>
              mkBar(`R${i}`, m === -1 ? 0 : m + 1, i + leftSize,
                m !== -1 ? '#10b981' : '#9ca3af',
                m === -1 ? `右${i}` : `右${i}←左${m}`)
            )
          ),
        }
        return true
      } else {
        const prevU = matchR[v]

        yield {
          description: `右部节点 ${v} 已被左部节点 ${prevU} 匹配。尝试为 ${prevU} 寻找新匹配`,
          codeLine: 4,
          objects: matchL.map((m, i) =>
            mkBar(`L${i}`, m === -1 ? 0 : m + 1, i,
              i === prevU ? '#f59e0b' : m !== -1 ? '#3b82f6' : '#6b7280',
              `左${i}`)
          ).concat(
            matchR.map((m, i) =>
              mkBar(`R${i}`, m === -1 ? 0 : m + 1, i + leftSize,
                '#9ca3af', `右${i}`)
            )
          ),
        }

        const found = yield* dfs(prevU, visited)
        if (found) {
          matchL[u] = v
          matchR[v] = u

          yield {
            description: `为 ${prevU} 找到新匹配！更新：左${u} ↔ 右${v}`,
            codeLine: 5,
            objects: matchL.map((m, i) =>
              mkBar(`L${i}`, m === -1 ? 0 : m + 1, i,
                m !== -1 ? '#10b981' : '#6b7280',
                m === -1 ? `左${i}` : `左${i}→右${m}`)
            ).concat(
              matchR.map((m, i) =>
                mkBar(`R${i}`, m === -1 ? 0 : m + 1, i + leftSize,
                  m !== -1 ? '#10b981' : '#9ca3af',
                  m === -1 ? `右${i}` : `右${i}←左${m}`)
              )
            ),
          }
          return true
        }
      }
    }

    yield {
      description: `左部节点 ${u} 无法匹配任何右部节点，匹配失败`,
      codeLine: 6,
      objects: matchL.map((m, i) =>
        mkBar(`L${i}`, m === -1 ? 0 : m + 1, i,
          i === u ? '#ef4444' : m !== -1 ? '#10b981' : '#6b7280',
          `左${i}`)
      ).concat(
        matchR.map((m, i) =>
          mkBar(`R${i}`, m === -1 ? 0 : m + 1, i + leftSize,
            '#9ca3af', `右${i}`)
        )
      ),
    }
    return false
  }

  for (let u = 0; u < leftSize; u++) {
    if (matchL[u] === -1) {
      const visited = Array(rightSize).fill(false)

      yield {
        description: `为左部节点 ${u} 启动增广路搜索`,
        codeLine: 7,
        objects: matchL.map((m, i) =>
          mkBar(`L${i}`, m === -1 ? 0 : m + 1, i,
            i === u ? '#f59e0b' : m !== -1 ? '#10b981' : '#6b7280',
            `左${i}`)
        ).concat(
          matchR.map((m, i) =>
            mkBar(`R${i}`, m === -1 ? 0 : m + 1, i + leftSize,
              '#9ca3af', `右${i}`)
          )
        ),
      }

      const found = yield* dfs(u, visited)
      if (found) totalMatch++
    }
  }

  yield {
    description: `匈牙利算法完成！最大匹配数 = ${totalMatch}，匹配对：${matchL.map((m, i) => m !== -1 ? `左${i}↔右${m}` : '').filter(Boolean).join(', ')}`,
    codeLine: 8,
    objects: matchL.map((m, i) =>
      mkBar(`L${i}`, m === -1 ? 0 : m + 1, i,
        m !== -1 ? '#10b981' : '#6b7280',
        m === -1 ? `左${i}(未匹配)` : `左${i}↔右${m}`)
    ).concat(
      matchR.map((m, i) =>
        mkBar(`R${i}`, m === -1 ? 0 : m + 1, i + leftSize,
          m !== -1 ? '#10b981' : '#9ca3af',
          m === -1 ? `右${i}(未匹配)` : `右${i}↔左${m}`)
      )
    ),
  }
}
