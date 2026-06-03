import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 6
  // 边列表: [from, to, weight]
  const edges: [number, number, number][] = [
    [0, 1, 4], [0, 2, 3],
    [1, 2, 1], [1, 3, 2],
    [2, 3, 4], [2, 4, 3],
    [3, 4, 2], [3, 5, 1],
    [4, 5, 6],
  ]

  // 按权重排序
  const sorted = [...edges].sort((a, b) => a[2] - b[2])

  // DSU
  const parent = Array.from({ length: size }, (_, i) => i)
  const rank = Array(size).fill(0)

  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]
      x = parent[x]
    }
    return x
  }

  function union(x: number, y: number): boolean {
    const rx = find(x)
    const ry = find(y)
    if (rx === ry) return false
    if (rank[rx] < rank[ry]) {
      parent[rx] = ry
    } else if (rank[rx] > rank[ry]) {
      parent[ry] = rx
    } else {
      parent[ry] = rx
      rank[rx]++
    }
    return true
  }

  // 组件归属数组：每个节点当前所属组件的代表
  const compSize = Array(size).fill(1)

  yield {
    description: '初始化：将每条边按权重从小到大排序。所有节点各自为一个集合（DSU 初始化）',
    codeLine: 1,
    objects: sorted.map(([u, v, w], i) =>
      mkBar(`e${i}`, w * 3, i, '#6b7280', `(${u}-${v}):${w}`)
    ),
  }

  yield {
    description: '按权重排序后的边列表。当前每个节点各自孤立，未选择任何边',
    codeLine: 2,
    objects: compSize.map((v, i) =>
      mkBar(`c${i}`, 1, i, '#3b82f6', `节点${i} `)
    ),
  }

  let mstWeight = 0
  let edgeCount = 0
  let selectedEdges: string[] = []

  for (let ei = 0; ei < sorted.length; ei++) {
    const [u, v, w] = sorted[ei]
    const rootU = find(u)
    const rootV = find(v)

    yield {
      description: `检查边 (${u}, ${v}) 权重 ${w}：find(${u}) = ${rootU}，find(${v}) = ${rootV}`,
      codeLine: 3,
      objects: compSize.map((_, i) => {
        const r = find(i)
        return mkBar(`c${i}`, compSize[r], i,
          i === u ? '#f59e0b' : i === v ? '#ef4444' : '#3b82f6',
          `节点${i}`)
      }),
    }

    if (rootU !== rootV) {
      union(u, v)
      const newRoot = find(u)
      compSize[newRoot] = compSize[rootU] + compSize[rootV]
      mstWeight += w
      edgeCount++
      selectedEdges.push(`(${u}-${v})`)

      yield {
        description: `✅ 选择边 (${u}, ${v}) 权重 ${w}。合并集合 ${rootU} 和 ${rootV}，已选边数：${edgeCount}`,
        codeLine: 4,
        objects: compSize.map((_, i) => {
          const r = find(i)
          return mkBar(`c${i}`, compSize[r], i,
            r === newRoot ? '#10b981' : '#3b82f6',
            `节点${i}`)
        }),
      }

      if (edgeCount === size - 1) {
        break
      }
    } else {
      yield {
        description: `跳过边 (${u}, ${v})：节点 ${u} 和 ${v} 已在同一集合中（代表 = ${rootU}），选中会形成环`,
        codeLine: 5,
        objects: compSize.map((_, i) => {
          const r = find(i)
          return mkBar(`c${i}`, compSize[r], i, '#6b7280', `节点${i}`)
        }),
      }
    }
  }

  yield {
    description: `Kruskal 算法完成！MST 总权重 = ${mstWeight}，边：${selectedEdges.join(', ')}`,
    codeLine: 6,
    objects: compSize.map((_, i) => {
      const r = find(i)
      return mkBar(`c${i}`, compSize[r], i, '#10b981', `节点${i}`)
    }),
  }
}
