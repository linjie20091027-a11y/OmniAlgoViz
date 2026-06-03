import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* bfsSearch(params: { size: number }): Generator<Scene> {
  const N = params.size
  // 一维数组模拟网格，0=可通行，1=障碍
  const grid: number[] = Array.from({ length: N }, () => Math.random() < 0.2 ? 1 : 0)
  const START = 0
  const END = N - 1
  grid[0] = grid[N - 1] = 0

  const gridBars = (visited: Set<number>, frontier: number[], current: number) =>
    grid.map((v, i) => {
      let color = v === 1 ? COLORS.inactive : COLORS.default
      if (i === current) color = COLORS.comparing
      if (frontier.includes(i)) color = COLORS.pointer
      if (visited.has(i)) color = COLORS.sorted
      if (i === START) color = COLORS.highlight
      if (i === END) color = COLORS.highlight
      return mkBar(`g-${i}`, v === 1 ? 0 : grid[i] + 5, i, color, v === 1 ? '#' : String.fromCharCode(65 + i))
    })

  yield { objects: gridBars(new Set(), [], -1), highlights: [], codeLine: 1, description: `网格规模=${N}，起点=0，终点=${END}` }

  const queue: number[] = [START]
  const visited = new Set<number>()
  visited.add(START)
  const parent: number[] = new Array(N).fill(-1)
  let found = false

  while (queue.length > 0) {
    const cur = queue.shift()!
    yield {
      objects: gridBars(visited, queue, cur),
      highlights: [`g-${cur}`],
      codeLine: 5,
      description: `出队节点 ${cur}，队列长度=${queue.length}`,
    }

    if (cur === END) { found = true; break }

    for (const nxt of [cur - 1, cur + 1]) {
      if (nxt < 0 || nxt >= N || visited.has(nxt) || grid[nxt] === 1) continue
      visited.add(nxt)
      parent[nxt] = cur
      queue.push(nxt)
      yield {
        objects: gridBars(visited, queue, cur),
        highlights: [`g-${nxt}`],
        codeLine: 8,
        description: `发现邻居 ${nxt}，加入队列`,
      }
    }
  }

  // 重建路径
  const path: number[] = []
  if (found) {
    let cur = END
    while (cur !== -1) { path.push(cur); cur = parent[cur] }
    path.reverse()
  }

  const pathSet = new Set(path)
  const final = grid.map((v, i) => {
    let color = v === 1 ? COLORS.inactive : COLORS.default
    if (pathSet.has(i)) color = COLORS.sorted
    if (i === START || i === END) color = COLORS.highlight
    return mkBar(`g-${i}`, v === 1 ? 0 : 5, i, color, v === 1 ? '#' : String.fromCharCode(65 + i))
  })
  yield { objects: final, highlights: path.map(i => `g-${i}`), codeLine: 12, description: found ? `BFS找到路径: ${path.join(' → ')}` : '终点不可达' }
}
