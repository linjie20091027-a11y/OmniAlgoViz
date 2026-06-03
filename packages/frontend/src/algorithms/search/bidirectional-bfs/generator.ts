import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* bidirectionalBfs(params: { size: number }): Generator<Scene> {
  const N = params.size
  const grid: number[] = Array.from({ length: N }, () => Math.random() < 0.2 ? 1 : 0)
  const START = 0
  const END = N - 1
  grid[0] = grid[N - 1] = 0

  const gridBars = (vF: Set<number>, vB: Set<number>, qF: number[], qB: number[], meet: number) =>
    grid.map((v, i) => {
      let color = v === 1 ? COLORS.inactive : COLORS.default
      if (i === meet) color = COLORS.highlight
      if (vF.has(i) && vB.has(i)) color = COLORS.highlight
      else if (vF.has(i)) color = COLORS.comparing
      else if (vB.has(i)) color = COLORS.pointer
      if (qF.includes(i)) color = COLORS.comparing
      if (qB.includes(i)) color = COLORS.pointer
      return mkBar(`g-${i}`, v === 1 ? 0 : 5, i, color, v === 1 ? '#' : String.fromCharCode(65 + i))
    })

  yield { objects: gridBars(new Set(), new Set(), [], [], -1), highlights: [], codeLine: 1, description: `双向BFS: 起点=${START}，终点=${END}` }

  const qF = [START], qB = [END]
  const vF = new Set<number>([START]), vB = new Set<number>([END])
  const pF = new Array(N).fill(-1), pB = new Array(N).fill(-1)
  let meet = -1

  while (qF.length > 0 && qB.length > 0 && meet === -1) {
    // 扩展前向
    const curF = qF.shift()!
    yield {
      objects: gridBars(vF, vB, qF, qB, -1),
      highlights: [`g-${curF}`],
      codeLine: 6,
      description: `正向BFS出队 ${curF}`,
    }

    for (const nxt of [curF - 1, curF + 1]) {
      if (nxt < 0 || nxt >= N || grid[nxt] === 1 || vF.has(nxt)) continue
      vF.add(nxt)
      pF[nxt] = curF
      qF.push(nxt)
      if (vB.has(nxt)) { meet = nxt; break }
    }
    if (meet >= 0) break

    // 扩展后向
    if (qB.length === 0) break
    const curB = qB.shift()!
    yield {
      objects: gridBars(vF, vB, qF, qB, -1),
      highlights: [`g-${curB}`],
      codeLine: 11,
      description: `反向BFS出队 ${curB}`,
    }

    for (const nxt of [curB - 1, curB + 1]) {
      if (nxt < 0 || nxt >= N || grid[nxt] === 1 || vB.has(nxt)) continue
      vB.add(nxt)
      pB[nxt] = curB
      qB.push(nxt)
      if (vF.has(nxt)) { meet = nxt; break }
    }
  }

  if (meet >= 0) {
    yield {
      objects: gridBars(vF, vB, qF, qB, meet),
      highlights: [`g-${meet}`],
      codeLine: 16,
      description: `✓ 两路相遇于节点 ${meet}！`,
    }

    // 重建路径
    const path: number[] = []
    let cur = meet
    while (cur !== -1) { path.unshift(cur); cur = pF[cur] }
    cur = pB[meet]
    while (cur !== -1) { path.push(cur); cur = pB[cur] }

    const pathSet = new Set(path)
    const finalBars = grid.map((v, i) => {
      let color = v === 1 ? COLORS.inactive : COLORS.default
      if (pathSet.has(i)) color = COLORS.sorted
      return mkBar(`g-${i}`, v === 1 ? 0 : 5, i, color, v === 1 ? '#' : String.fromCharCode(65 + i))
    })
    yield { objects: finalBars, highlights: path.map(i => `g-${i}`), codeLine: 19, description: `完整路径: ${path.join(' → ')}` }
  }
}
