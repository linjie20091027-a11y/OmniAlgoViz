import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function toBars(tree: number[], highlights: string[] = [], focusIdx: number | null = null): BarObject[] {
  return tree.map((v, i) => {
    let color = COLORS.default
    if (i === 0) color = COLORS.inactive
    if (highlights.includes(`seg-${i}`)) color = COLORS.highlight
    if (focusIdx === i) color = COLORS.comparing
    if (v === 0 && i > 0) color = COLORS.inactive
    return mkBar(`seg-${i}`, v, i, color)
  })
}

function build(tree: number[], arr: number[], node: number, l: number, r: number, scenes: Scene[]): number {
  if (l === r) {
    tree[node] = arr[l]
    scenes.push({
      objects: toBars(tree, [`seg-${node}`]),
      highlights: [`seg-${node}`],
      codeLine: 4,
      description: `叶子节点 ${node}：区间 [${l},${l}]，值 = ${arr[l]}`,
    })
    return tree[node]
  }
  const mid = Math.floor((l + r) / 2)
  const leftVal = build(tree, arr, node * 2, l, mid, scenes)
  const rightVal = build(tree, arr, node * 2 + 1, mid + 1, r, scenes)
  tree[node] = leftVal + rightVal
  scenes.push({
    objects: toBars(tree, [`seg-${node}`]),
    highlights: [`seg-${node}`],
    codeLine: 6,
    description: `内部节点 ${node}：区间 [${l},${r}]，值 = ${leftVal} + ${rightVal} = ${tree[node]}`,
  })
  return tree[node]
}

function query(tree: number[], node: number, l: number, r: number, ql: number, qr: number, scenes: Scene[]): number {
  if (ql <= l && r <= qr) {
    scenes.push({
      objects: toBars(tree, [`seg-${node}`]),
      highlights: [`seg-${node}`],
      codeLine: 10,
      description: `查询区间 [${ql},${qr}]：节点 ${node} 的区间 [${l},${r}] 完全包含，直接返回 ${tree[node]}`,
    })
    return tree[node]
  }
  if (qr < l || r < ql) {
    return 0
  }
  const mid = Math.floor((l + r) / 2)
  const leftSum = query(tree, node * 2, l, mid, ql, qr, scenes)
  const rightSum = query(tree, node * 2 + 1, mid + 1, r, ql, qr, scenes)
  return leftSum + rightSum
}

export default function* segmentTreeGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 20) + 1)
  const treeSize = 4 * n + 1
  const tree: number[] = new Array(treeSize).fill(0)

  yield {
    objects: [mkBar('seg-0', 0, 0, COLORS.inactive)],
    highlights: [],
    codeLine: 1,
    description: `初始化线段树，原始数组：[${arr.join(', ')}]，总区间 [0, ${n - 1}]`,
  }

  const buildScenes: Scene[] = []
  build(tree, arr, 1, 0, n - 1, buildScenes)
  yield* buildScenes

  yield {
    objects: toBars(tree).map((b, i) => {
      if (tree[i] > 0) return { ...b, color: COLORS.sorted }
      return b
    }),
    highlights: [],
    codeLine: 8,
    description: '线段树构建完成',
  }

  const ql = Math.floor(n / 4)
  const qr = Math.floor(3 * n / 4)

  yield {
    objects: toBars(tree),
    highlights: [],
    codeLine: 9,
    description: `查询区间和 query(${ql}, ${qr})`,
  }

  const queryScenes: Scene[] = []
  const result = query(tree, 1, 0, n - 1, ql, qr, queryScenes)
  yield* queryScenes

  const verifySum = arr.slice(ql, qr + 1).reduce((s, v) => s + v, 0)
  yield {
    objects: toBars(tree),
    highlights: [],
    codeLine: 14,
    description: `区间 [${ql},${qr}] 之和 = ${result}，验证：arr[${ql}..${qr}] 之和 = ${verifySum}`,
  }
}
