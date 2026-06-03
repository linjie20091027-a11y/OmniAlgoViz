import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const N = 6
  // 边列表: [from, to, weight]
  const edges: [number, number, number][] = [
    [0, 1, 4], [0, 2, 3],
    [1, 2, 1], [1, 3, 2],
    [2, 3, 4], [2, 4, 3],
    [3, 4, 2], [3, 5, 1],
    [4, 5, 6],
  ]

  // 构建邻接表
  const adj: [number, number][][] = Array.from({ length: N }, () => [])
  for (const [u, v, w] of edges) {
    adj[u].push([v, w])
    adj[v].push([u, w])
  }

  yield {
    description: '给定一个加权连通无向图，含 6 个节点、9 条边。分别用 Kruskal 和 Prim 求 MST，比较两步差异',
    codeLine: 1,
    objects: Array.from({ length: N }, (_, i) =>
      mkBar(`n${i}`, 0, i, '#6b7280', `节点${i}`)
    ),
  }

  // ============ Kruskal ============
  yield {
    description: '【Kruskal 策略】将所有边按权重排序，用并查集逐条检查，不形成环则选中',
    codeLine: 2,
    objects: edges.map(([u, v, w], i) =>
      mkBar(`ek${i}`, w * 3, i, '#8b5cf6', `边${i}(${u}-${v}):${w}`)
    ),
  }

  {
    const sorted = [...edges].sort((a, b) => a[2] - b[2])
    const parent = Array.from({ length: N }, (_, i) => i)
    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x] }
      return x
    }
    let kEdgeCount = 0
    let kWeight = 0

    for (const [u, v, w] of sorted) {
      const ru = find(u)
      const rv = find(v)
      if (ru !== rv) {
        parent[ru] = rv
        kEdgeCount++
        kWeight += w

        yield {
          description: `[Kruskal] 选中边 (${u}, ${v}) 权重 ${w}。累计边数 = ${kEdgeCount}，累计权重 = ${kWeight}`,
          codeLine: 3,
          objects: Array.from({ length: N }, (_, i) => {
            const r = find(i)
            return mkBar(`nk${i}`, r + 1, i,
              find(i) === find(0) ? '#8b5cf6' : '#6b7280', `节点${i}`)
          }),
        }
      }
    }

    yield {
      description: `[Kruskal 完成] MST 总权重 = ${kWeight}，共 ${kEdgeCount} 条边`,
      codeLine: 4,
      objects: Array.from({ length: N }, (_, i) =>
        mkBar(`nk${i}`, 1, i, '#8b5cf6', `节点${i}`)
      ),
    }
  }

  // ============ Prim ============
  yield {
    description: '【Prim 策略】从节点 0 开始，每次选择与已选集合相连的最小权边，逐步扩展 MST',
    codeLine: 5,
    objects: Array.from({ length: N }, (_, i) =>
      mkBar(`np${i}`, 0, i, '#06b6d4', `节点${i}`)
    ),
  }

  {
    const INF = 999
    const key: number[] = Array(N).fill(INF)
    const visited: boolean[] = Array(N).fill(false)
    key[0] = 0
    let pWeight = 0

    for (let iter = 0; iter < N; iter++) {
      let u = -1
      let minKey = INF
      for (let i = 0; i < N; i++) {
        if (!visited[i] && key[i] < minKey) {
          u = i; minKey = key[i]
        }
      }
      if (u === -1) break

      visited[u] = true
      if (iter > 0) pWeight += key[u]

      yield {
        description: `[Prim 第 ${iter + 1} 步] 选中节点 ${u}（key = ${key[u] === 0 ? '0(起点)' : key[u]}），加入 MST`,
        codeLine: 6,
        objects: Array.from({ length: N }, (_, i) =>
          mkBar(`np${i}`, key[i] === INF ? 0 : key[i] * 2, i,
            visited[i] ? '#06b6d4' : '#6b7280', `节点${i}`)
        ),
      }

      for (const [v, w] of adj[u]) {
        if (!visited[v] && w < key[v]) {
          key[v] = w

          yield {
            description: `[Prim] 更新节点 ${v} 的 key = ${w}（通过边 (${u}, ${v})）`,
            codeLine: 6,
            objects: Array.from({ length: N }, (_, i) =>
              mkBar(`np${i}`, key[i] === INF ? 0 : key[i] * 2, i,
                i === v ? '#f59e0b' : visited[i] ? '#06b6d4' : '#6b7280',
                `节点${i}`)
            ),
          }
        }
      }
    }

    yield {
      description: `[Prim 完成] MST 总权重 = ${pWeight}`,
      codeLine: 7,
      objects: Array.from({ length: N }, (_, i) =>
        mkBar(`np${i}`, 1, i, '#06b6d4', `节点${i}`)
      ),
    }
  }

  // ============ 对比 ============
  yield {
    description: '【对比总结】Kruskal 以边为中心，适合稀疏图；Prim 以顶点为中心，适合稠密图。两者都保证了 MST 的最小权性质',
    codeLine: 8,
    objects: Array.from({ length: N }, (_, i) =>
      mkBar(`c${i}`, i + 1, i, '#10b981', `节点${i}`)
    ),
  }
}
