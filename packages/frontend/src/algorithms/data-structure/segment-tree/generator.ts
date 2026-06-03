import type { Scene, TreeNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* segTreeGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1)
  const treeSize = 4 * n
  const tree = new Array(treeSize).fill(0)

  function build(node: number, l: number, r: number, scenes: Scene[]) {
    if (l === r) {
      tree[node] = arr[l]
      return
    }
    const mid = Math.floor((l + r) / 2)
    build(node * 2, l, mid, scenes)
    build(node * 2 + 1, mid + 1, r, scenes)
    tree[node] = tree[node * 2] + tree[node * 2 + 1]
  }

  function buildTreeObjects(): TreeNodeObject[] {
    const result: TreeNodeObject[] = []
    function dfs(idx: number, l: number, r: number) {
      const left = idx * 2, right = idx * 2 + 1
      const children: string[] = []
      if (l < r) {
        const mid = Math.floor((l + r) / 2)
        children.push(`seg-${left}`)
        children.push(`seg-${right}`)
        dfs(left, l, mid)
        dfs(right, mid + 1, r)
      }
      result.push({
        kind: 'treeNode',
        id: `seg-${idx}`,
        value: tree[idx] ?? 0,
        parentId: idx === 1 ? null : `seg-${Math.floor(idx / 2)}`,
        children,
        color: l === r ? COLORS.sorted : COLORS.default,
      })
    }
    dfs(1, 0, n - 1)
    return result
  }

  yield { objects: [], highlights: [], codeLine: 1, description: `构建线段树，原数组: [${arr.join(', ')}]` }

  const buildScenes: Scene[] = []
  build(1, 0, n - 1, buildScenes)

  yield { objects: buildTreeObjects(), highlights: [], codeLine: 6, description: `线段树构建完成，根节点区间和 = ${tree[1]}` }

  // 查询示例: range [1, 3]
  const ql = 1, qr = Math.min(3, n - 1)
  if (ql <= qr) {
    let querySum = 0
    function* query(node: number, l: number, r: number, ql: number, qr: number): Generator<Scene> {
      if (ql <= l && r <= qr) {
        querySum += tree[node]
        yield {
          objects: buildTreeObjects().map(o => o.id === `seg-${node}` ? { ...o, color: COLORS.highlight } : o),
          highlights: [`seg-${node}`],
          codeLine: 9,
          description: `节点 [${l},${r}] 完全在查询区间内，累加值 ${tree[node]}`,
        }
        return
      }
      const mid = Math.floor((l + r) / 2)
      yield {
        objects: buildTreeObjects().map(o => o.id === `seg-${node}` ? { ...o, color: COLORS.comparing } : o),
        highlights: [`seg-${node}`],
        codeLine: 10,
        description: `查询节点 [${l},${r}] 需要分裂`,
      }
      if (ql <= mid) yield* query(node * 2, l, mid, ql, qr)
      if (qr > mid) yield* query(node * 2 + 1, mid + 1, r, ql, qr)
    }
    const queryGen = query(1, 0, n - 1, ql, qr)
    for (const s of queryGen) yield s
    yield {
      objects: buildTreeObjects(),
      highlights: [],
      codeLine: 14,
      description: `区间 [${ql},${qr}] 查询结果 = ${querySum}`,
    }
  }
}
