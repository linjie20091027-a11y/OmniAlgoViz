import type { Scene, PointObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkPoint(id: string, x: number, y: number, color: string, selected: boolean = false): PointObject {
  return { kind: 'point', id, x, y, color, selected }
}

export default function* closestPair(params: { size: number }): Generator<Scene> {
  const n = params.size
  const pts: { id: string; x: number; y: number }[] = []
  for (let i = 0; i < n; i++) {
    pts.push({ id: `p-${i}`, x: 50 + Math.random() * 700, y: 50 + Math.random() * 400 })
  }

  const pointObjs = (highlight: number[], pair: number[]) =>
    pts.map((p, i) => {
      let color = COLORS.default
      if (pair.includes(i)) color = COLORS.sorted
      if (highlight.includes(i)) color = COLORS.comparing
      return mkPoint(p.id, p.x, p.y, color, pair.includes(i))
    })

  yield { objects: pointObjs([], []), highlights: [], codeLine: 1, description: `${n} 个随机点，分治求最近点对` }

  function dist(a: typeof pts[0], b: typeof pts[0]) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
  }

  const sortedX = pts.map((p, i) => ({ ...p, idx: i })).sort((a, b) => a.x - b.x)
  let best = Infinity
  let bestPair = [0, 1]

  function* solve(l: number, r: number): Generator<any> {
    if (l >= r) return
    if (l + 1 === r) {
      const d = dist(sortedX[l], sortedX[r])
      if (d < best) { best = d; bestPair = [sortedX[l].idx, sortedX[r].idx] }
      return
    }

    const mid = Math.floor((l + r) / 2)
    const midX = sortedX[mid].x

    yield {
      objects: pointObjs(
        Array.from({ length: r - l + 1 }, (_, i) => sortedX[l + i].idx),
        bestPair,
      ),
      highlights: [sortedX[mid].id],
      codeLine: 6,
      description: `分治: 区间 [${l}, ${r}]，中点 x=${midX.toFixed(0)}`,
    }

    yield* solve(l, mid)
    yield* solve(mid + 1, r)

    // 合并跨越中线的点
    const strip = sortedX.filter(p => Math.abs(p.x - midX) < best)
    strip.sort((a, b) => a.y - b.y)

    yield {
      objects: pointObjs(
        strip.map(p => p.idx),
        bestPair,
      ),
      highlights: [],
      codeLine: 10,
      description: `带状区域: ${strip.length} 个点，宽度=${(best * 2).toFixed(0)}`,
    }

    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && strip[j].y - strip[i].y < best; j++) {
        const d = dist(strip[i], strip[j])
        if (d < best) { best = d; bestPair = [strip[i].idx, strip[j].idx] }
      }
    }
  }

  // 手动迭代生成器
  const gen = solve(0, sortedX.length - 1)
  let step = 0
  while (true) {
    const result = gen.next()
    if (result.value !== undefined) yield result.value
    if (result.done) break
    if (++step > 200) break
  }

  yield {
    objects: pointObjs([], bestPair),
    highlights: [pts[bestPair[0]].id, pts[bestPair[1]].id],
    codeLine: 16,
    description: `最近点对: (${pts[bestPair[0]].x.toFixed(0)}, ${pts[bestPair[0]].y.toFixed(0)}) 和 (${pts[bestPair[1]].x.toFixed(0)}, ${pts[bestPair[1]].y.toFixed(0)})，距离=${best.toFixed(2)}`,
  }
}
