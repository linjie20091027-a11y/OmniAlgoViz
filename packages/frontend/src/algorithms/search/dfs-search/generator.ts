import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* dfsSearch(params: { size: number }): Generator<Scene> {
  const N = params.size
  const grid: number[] = Array.from({ length: N }, () => Math.random() < 0.2 ? 1 : 0)
  const START = 0
  const END = N - 1
  grid[0] = grid[N - 1] = 0

  const gridBars = (visited: Set<number>, path: number[], current: number) =>
    grid.map((v, i) => {
      let color = v === 1 ? COLORS.inactive : COLORS.default
      if (i === current) color = COLORS.comparing
      if (path.includes(i)) color = COLORS.sorted
      if (visited.has(i) && !path.includes(i)) color = COLORS.inactive
      if (i === START || i === END) color = COLORS.highlight
      return mkBar(`g-${i}`, v === 1 ? 0 : grid[i] + 5, i, color, v === 1 ? '#' : String.fromCharCode(65 + i))
    })

  yield { objects: gridBars(new Set(), [], -1), highlights: [], codeLine: 1, description: `DFS搜索: 起点=${START}，终点=${END}` }

  const visited = new Set<number>()
  const path: number[] = []
  let found = false

  function* dfs(cur: number): Generator<Scene> {
    visited.add(cur)
    path.push(cur)

    yield {
      objects: gridBars(visited, path, cur),
      highlights: [`g-${cur}`],
      codeLine: 4,
      description: `访问节点 ${cur}，当前路径: [${path.join(',')}]`,
    }

    if (cur === END) { found = true; return }

    for (const nxt of [cur + 1, cur - 1]) {
      if (found) return
      if (nxt < 0 || nxt >= N || visited.has(nxt) || grid[nxt] === 1) continue

      yield {
        objects: gridBars(visited, path, cur),
        highlights: [`g-${nxt}`],
        codeLine: 7,
        description: `探索邻居 ${nxt}`,
      }

      yield* dfs(nxt)
      if (found) return
    }

    path.pop()
    yield {
      objects: gridBars(visited, path, cur),
      highlights: [],
      codeLine: 11,
      description: `回溯，从路径移除 ${cur}`,
    }
  }

  yield* dfs(START)

  if (found) {
    const pathSet = new Set(path)
    const finalBars = grid.map((v, i) => {
      let color = v === 1 ? COLORS.inactive : COLORS.default
      if (pathSet.has(i)) color = COLORS.sorted
      return mkBar(`g-${i}`, v === 1 ? 0 : 5, i, color, v === 1 ? '#' : String.fromCharCode(65 + i))
    })
    yield { objects: finalBars, highlights: path.map(i => `g-${i}`), codeLine: 15, description: `DFS找到路径: ${path.join(' → ')}` }
  } else {
    yield { objects: gridBars(visited, path, -1), highlights: [], codeLine: 16, description: '无可行路径' }
  }
}
