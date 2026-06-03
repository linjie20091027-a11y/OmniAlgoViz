import type { Scene, TreeNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* fenwickGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 30) + 1)
  const bit = new Array(n + 1).fill(0)

  function add(idx: number, val: number) {
    while (idx <= n) { bit[idx] += val; idx += idx & -idx }
  }

  function buildTreeObjects(): TreeNodeObject[] {
    const result: TreeNodeObject[] = []
    const cover = new Map<number, number[]>()
    for (let i = 1; i <= n; i++) {
      const p = i + (i & -i)
      if (p <= n) { const l = cover.get(p) || []; l.push(i); cover.set(p, l) }
    }
    result.push({
      kind: 'treeNode', id: 'fen-0', value: 0, parentId: null,
      children: Array.from({ length: n }, (_, i) => `fen-${i + 1}`),
      color: COLORS.inactive,
    })
    for (let i = 1; i <= n; i++) {
      const kids = (cover.get(i) || []).map(String)
      result.push({
        kind: 'treeNode',
        id: `fen-${i}`,
        value: bit[i],
        parentId: i + (i & -i) <= n ? `fen-${i + (i & -i)}` : 'fen-0',
        children: kids.map(k => `fen-${k}`),
        color: COLORS.default,
      })
    }
    return result
  }

  yield { objects: [], highlights: [], codeLine: 1, description: `构建树状数组，原数组: [${arr.join(', ')}]` }

  for (let i = 0; i < n; i++) {
    add(i + 1, arr[i])
    yield {
      objects: buildTreeObjects().map(o => o.id === `fen-${i + 1}` ? { ...o, color: COLORS.sorted } : o),
      highlights: [`fen-${i + 1}`],
      codeLine: 4,
      description: `插入 arr[${i}]=${arr[i]}`,
    }
  }

  // 前缀和查询
  const queryIdx = Math.min(n, 4)
  let sum = 0
  for (let i = queryIdx; i > 0; i -= i & -i) {
    sum += bit[i]
    yield {
      objects: buildTreeObjects().map(o => o.id === `fen-${i}` ? { ...o, color: COLORS.highlight } : o),
      highlights: [`fen-${i}`],
      codeLine: 8,
      description: `query(${queryIdx}) 累加 BIT[${i}]=${bit[i]}`,
    }
  }
  yield {
    objects: buildTreeObjects(),
    highlights: [],
    codeLine: 11,
    description: `前 ${queryIdx} 个元素的和 = ${sum}`,
  }
}
