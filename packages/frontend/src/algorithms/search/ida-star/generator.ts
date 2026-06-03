import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* idaStar(params: { size: number }): Generator<Scene> {
  const N = params.size
  const grid: number[] = Array.from({ length: N }, () => Math.random() < 0.2 ? 1 : 0)
  const START = 0
  const END = N - 1
  grid[0] = grid[N - 1] = 0

  const heuristic = (pos: number) => Math.abs(END - pos)

  const gridBars = (path: number[], cur: number, threshold: number) =>
    grid.map((v, i) => {
      let color = v === 1 ? COLORS.inactive : COLORS.default
      if (i === cur) color = COLORS.comparing
      if (path.includes(i)) color = COLORS.sorted
      if (i === START || i === END) color = COLORS.highlight
      return mkBar(`g-${i}`, v === 1 ? 0 : 5, i, color, `f=${path.length + heuristic(i)}`)
    })

  yield { objects: gridBars([], -1, 0), highlights: [], codeLine: 1, description: `IDA*搜索: 起点=${START}，终点=${END}` }

  let threshold = heuristic(START)
  const path: number[] = [START]
  let found = false

  while (!found) {
    yield {
      objects: gridBars(path, path[path.length - 1], threshold),
      highlights: [],
      codeLine: 4,
      description: `当前阈值 threshold = ${threshold}，开始深度优先搜索`,
    }

    function* search(node: number, g: number, visited: Set<number>): Generator<Scene, { nextThreshold: number; found: boolean }> {
      const f = g + heuristic(node)

      yield {
        objects: gridBars(path, node, threshold),
        highlights: [`g-${node}`],
        codeLine: 7,
        description: `访问节点 ${node}，f=${f} (g=${g}, h=${heuristic(node)})，阈值=${threshold}`,
      }

      if (f > threshold) {
        return { nextThreshold: f, found: false }
      }
      if (node === END) {
        return { nextThreshold: threshold, found: true }
      }

      let min = Infinity
      for (const nxt of [node + 1, node - 1]) {
        if (nxt < 0 || nxt >= N || grid[nxt] === 1 || visited.has(nxt)) continue
        visited.add(nxt)
        path.push(nxt)
        const result = yield* search(nxt, g + 1, visited)
        if (result.found) return result
        min = Math.min(min, result.nextThreshold)
        path.pop()
        visited.delete(nxt)
      }
      return { nextThreshold: min, found: false }
    }

    const visited = new Set<number>()
    visited.add(START)
    // 手动迭代生成器以控制步骤
    const gen = search(START, 0, visited)
    let nextThr = Infinity
    let iterCount = 0

    while (true) {
      iterCount++
      const step = gen.next()
      if (step.done) {
        const result = step.value as { nextThreshold: number; found: boolean }
        nextThr = result.nextThreshold
        found = result.found
        break
      }
      if (iterCount > 100) break
    }

    if (!found) {
      yield {
        objects: gridBars(path, -1, threshold),
        highlights: [],
        codeLine: 14,
        description: `未找到路径，阈值增加到 ${nextThr}`,
      }
      threshold = nextThr === Infinity ? threshold * 2 : nextThr
    }
  }

  // 展示找到的路径
  const pathSet = new Set(path)
  const finalBars = grid.map((v, i) => {
    let color = v === 1 ? COLORS.inactive : COLORS.default
    if (pathSet.has(i)) color = COLORS.sorted
    return mkBar(`g-${i}`, v === 1 ? 0 : 5, i, color, v === 1 ? '#' : String.fromCharCode(65 + i))
  })
  yield { objects: finalBars, highlights: path.map(i => `g-${i}`), codeLine: 18, description: found ? `IDA*找到路径: ${path.join(' → ')}` : '未找到' }
}
