import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function toBars(parent: number[], rank: number[], highlights: string[] = [], focusIdx: number | null = null): BarObject[] {
  return parent.map((p, i) => {
    let color = COLORS.default
    if (p === i) color = COLORS.sorted
    if (highlights.includes(`dsu-${i}`)) color = COLORS.highlight
    if (focusIdx === i) color = COLORS.comparing
    return mkBar(`dsu-${i}`, rank[i] + 1, i, color, `父:${p} 秩:${rank[i]}`)
  })
}

function find(parent: number[], x: number, scenes: Scene[]): number {
  if (parent[x] !== x) {
    const root = find(parent, parent[x], scenes)
    parent[x] = root // 路径压缩
    scenes.push({
      objects: toBars(parent, [], [`dsu-${x}`]),
      highlights: [`dsu-${x}`],
      codeLine: 6,
      description: `路径压缩：将 ${x} 的父节点直接设为根 ${root}`,
    })
  }
  return parent[x]
}

export default function* disjointSetGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const parent: number[] = Array.from({ length: n }, (_, i) => i)
  const rank: number[] = new Array(n).fill(0)

  yield {
    objects: toBars(parent, rank),
    highlights: [],
    codeLine: 1,
    description: `初始化并查集，共 ${n} 个元素：每个元素的父节点指向自己`,

  }

  const unions: Array<[number, number]> = [
    [0, 1], [2, 3], [4, 5], [6, 7],
    [1, 3], [5, 7], [0, 5],
  ].slice(0, Math.min(7, n)) as Array<[number, number]>

  for (const [a, b] of unions) {
    if (a >= n || b >= n) break
    yield {
      objects: toBars(parent, rank, [], a),
      highlights: [],
      codeLine: 3,
      description: `union(${a}, ${b}) —— 查找 ${a} 和 ${b} 的根节点`,
    }

    let rootA = a
    while (parent[rootA] !== rootA) rootA = parent[rootA]
    let rootB = b
    while (parent[rootB] !== rootB) rootB = parent[rootB]

    yield {
      objects: toBars(parent, rank, [`dsu-${rootA}`, `dsu-${rootB}`]),
      highlights: [`dsu-${rootA}`, `dsu-${rootB}`],
      codeLine: 5,
      description: `${a} 的根 = ${rootA}，${b} 的根 = ${rootB}`,
    }

    if (rootA !== rootB) {
      if (rank[rootA] < rank[rootB]) {
        [rootA, rootB] = [rootB, rootA]
      }
      parent[rootB] = rootA
      if (rank[rootA] === rank[rootB]) rank[rootA]++

      yield {
        objects: toBars(parent, rank, [`dsu-${rootB}`], rootA),
        highlights: [`dsu-${rootB}`],
        codeLine: 7,
        description: `按秩合并：将 ${rootB} 合并到 ${rootA}，${rootA} 秩 = ${rank[rootA]}`,
      }
    } else {
      yield {
        objects: toBars(parent, rank),
        highlights: [],
        codeLine: 8,
        description: `${a} 和 ${b} 已在同一集合，无需合并`,
      }
    }
  }

  yield {
    objects: toBars(parent, rank).map((b, i) => {
      if (parent[i] === i) return { ...b, color: COLORS.sorted }
      return b
    }),
    highlights: [],
    codeLine: 10,
    description: '所有合并操作完成',
  }
}
