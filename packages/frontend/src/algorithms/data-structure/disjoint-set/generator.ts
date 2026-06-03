import type { Scene, TreeNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* dsuGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const parent = Array.from({ length: n }, (_, i) => i)
  const rank = new Array(n).fill(0)

  function buildTreeObjects(): TreeNodeObject[] {
    const children = new Map<number, number[]>()
    for (let i = 0; i < n; i++) {
      if (parent[i] !== i) {
        const list = children.get(parent[i]) || []
        list.push(i)
        children.set(parent[i], list)
      }
    }
    const result: TreeNodeObject[] = []
    function dfs(node: number) {
      const kids = (children.get(node) || []).map(String)
      result.push({
        kind: 'treeNode',
        id: `dsu-${node}`,
        value: node,
        parentId: parent[node] === node ? null : `dsu-${parent[node]}`,
        children: kids.map(k => `dsu-${k}`),
        color: parent[node] === node ? COLORS.sorted : COLORS.default,
      })
      for (const c of children.get(node) || []) dfs(c)
    }
    for (let i = 0; i < n; i++) {
      if (parent[i] === i) dfs(i)
    }
    return result
  }

  yield { objects: buildTreeObjects(), highlights: [], codeLine: 1, description: `初始化并查集，${n} 个元素各自为根` }

  const unions: [number, number][] = [[0, 1], [2, 3], [4, 5], [1, 3], [0, 5]]
  for (const [a, b] of unions) {
    if (a >= n || b >= n) continue
    let ra = a; while (parent[ra] !== ra) ra = parent[ra]
    let rb = b; while (parent[rb] !== rb) rb = parent[rb]

    yield {
      objects: buildTreeObjects().map(n =>
        n.id === `dsu-${ra}` || n.id === `dsu-${rb}` ? { ...n, color: COLORS.comparing } : n
      ),
      highlights: [`dsu-${ra}`, `dsu-${rb}`],
      codeLine: 4,
      description: `Find(${a})=${ra}, Find(${b})=${rb}`,
    }

    if (ra !== rb) {
      if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra]
      parent[rb] = ra
      if (rank[ra] === rank[rb]) rank[ra]++
      yield {
        objects: buildTreeObjects().map(n =>
          n.id === `dsu-${rb}` ? { ...n, color: COLORS.swapping } : n
        ),
        highlights: [`dsu-${rb}`],
        codeLine: 7,
        description: `合并：${rb} 的父节点变为 ${ra}`,
      }
    }
  }

  yield { objects: buildTreeObjects(), highlights: [], codeLine: 12, description: '并查集操作完成' }
}
