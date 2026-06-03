import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* aStar(params: { size: number }): Generator<Scene> {
  const N = params.size
  const grid: number[] = Array.from({ length: N }, () => Math.random() < 0.2 ? 1 : 0)
  const START = 0
  const END = N - 1
  grid[0] = grid[N - 1] = 0

  const heuristic = (pos: number) => Math.abs(END - pos)

  const gridBars = (g: Map<number, number>, open: number[], closed: Set<number>, cur: number, path: Set<number>) =>
    grid.map((v, i) => {
      let color = v === 1 ? COLORS.inactive : COLORS.default
      if (i === cur) color = COLORS.comparing
      if (path.has(i)) color = COLORS.sorted
      if (open.includes(i)) color = COLORS.pointer
      if (closed.has(i) && !path.has(i)) color = COLORS.inactive
      if (i === START || i === END) color = COLORS.highlight
      return mkBar(`g-${i}`, v === 1 ? 0 : g.get(i) ?? 10, i, color, `f=${(g.get(i) ?? 0) + heuristic(i)}`)
    })

  yield { objects: gridBars(new Map(), [], new Set(), -1, new Set()), highlights: [], codeLine: 1, description: `A*搜索: 起点=${START}，终点=${END}` }

  const gScore = new Map<number, number>()
  gScore.set(START, 0)
  const open: number[] = [START]
  const closed = new Set<number>()
  const parent = new Map<number, number>()
  let found = false

  while (open.length > 0) {
    open.sort((a, b) => (gScore.get(a)! + heuristic(a)) - (gScore.get(b)! + heuristic(b)))
    const cur = open.shift()!

    yield {
      objects: gridBars(gScore, open, closed, cur, new Set()),
      highlights: [`g-${cur}`],
      codeLine: 6,
      description: `取开销最小节点 ${cur}，f=${(gScore.get(cur) ?? 0) + heuristic(cur)} (g=${gScore.get(cur)}, h=${heuristic(cur)})`,
    }

    if (cur === END) { found = true; break }
    closed.add(cur)

    for (const nxt of [cur - 1, cur + 1]) {
      if (nxt < 0 || nxt >= N || grid[nxt] === 1 || closed.has(nxt)) continue
      const tentG = (gScore.get(cur) ?? 0) + 1
      if (tentG < (gScore.get(nxt) ?? Infinity)) {
        gScore.set(nxt, tentG)
        parent.set(nxt, cur)
        if (!open.includes(nxt)) open.push(nxt)
        yield {
          objects: gridBars(gScore, open, closed, cur, new Set()),
          highlights: [`g-${nxt}`],
          codeLine: 9,
          description: `更新节点 ${nxt}: g=${tentG}, f=${tentG + heuristic(nxt)}`,
        }
      }
    }
  }

  // 重建路径
  const pathSet = new Set<number>()
  if (found) {
    let cur = END
    while (cur !== START) { pathSet.add(cur); cur = parent.get(cur)! }
    pathSet.add(START)
  }

  const finalBars = grid.map((v, i) => {
    let color = v === 1 ? COLORS.inactive : COLORS.default
    if (pathSet.has(i)) color = COLORS.sorted
    return mkBar(`g-${i}`, v === 1 ? 0 : 5, i, color, v === 1 ? '#' : String.fromCharCode(65 + i))
  })
  yield { objects: finalBars, highlights: [...pathSet].map(i => `g-${i}`), codeLine: 14, description: found ? 'A*找到最优路径' : '无路径' }
}
