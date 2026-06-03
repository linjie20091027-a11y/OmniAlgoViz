import { COLORS, type Scene, type TreeNodeObject } from '@vsa/shared'

function mkNode(id: string, value: string | number, parentId: string | null, color: string, children: string[] = []): TreeNodeObject {
  return { kind: 'treeNode', id, value, parentId, children, color }
}

export default function* idaStarSearch(params: { size: number }): Generator<Scene> {
  const N = params.size
  const grid: number[][] = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => (Math.random() < 0.22 ? 1 : 0))
  )
  grid[0][0] = 0
  grid[4][4] = 0

  const START = [0, 0]
  const END = [4, 4]
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]

  function heuristic(r: number, c: number): number {
    return Math.abs(r - END[0]) + Math.abs(c - END[1])
  }

  yield {
    objects: [mkNode('root', `起点(${START[0]},${START[1]}) 阈值`, null, COLORS.highlight)],
    codeLine: 1,
    description: `IDA* 迭代加深搜索，起点(${START[0]},${START[1]}) → 终点(${END[0]},${END[1]})`,
  }

  let threshold = heuristic(START[0], START[1])
  let nodeCounter = 0
  const allNodes: Map<string, TreeNodeObject> = new Map()
  allNodes.set('root', mkNode('root', `阈值=${threshold}`, null, COLORS.highlight))
  let found = false

  for (let iter = 0; iter < 5 && !found; iter++) {
    let nextThreshold = Infinity
    const thresholdNode = mkNode(`threshold-${iter}`, `迭代${iter + 1} 阈值=${threshold}`, 'root', COLORS.pivot)
    allNodes.set(`threshold-${iter}`, thresholdNode)

    if (allNodes.get('root')!.children.length === 0) {
      allNodes.get('root')!.children.push(`threshold-${iter}`)
    }

    yield {
      objects: Array.from(allNodes.values()).map(n => ({ ...n, children: [...n.children] })),
      codeLine: 3,
      description: `IDA* 迭代 ${iter + 1}：以 threshold=${threshold} 进行深度受限搜索`,
    }

    interface DFSResult { found: boolean, nextThreshold: number }
    function dfs(r: number, c: number, g: number, pid: string): DFSResult {
      if (visited.has(`${r},${c}`)) return { found: false, nextThreshold: Infinity }

      const f = g + heuristic(r, c)
      if (f > threshold) return { found: false, nextThreshold: f }

      visited.add(`${r},${c}`)

      if (r === END[0] && c === END[1]) return { found: true, nextThreshold: threshold }

      let minNext = Infinity
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc
        if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && grid[nr][nc] === 0) {
          const result = dfs(nr, nc, g + 1, pid)
          if (result.found) return result
          minNext = Math.min(minNext, result.nextThreshold)
        }
      }

      visited.delete(`${r},${c}`)
      return { found: false, nextThreshold: minNext }
    }

    const visited = new Set<string>()
    let minNextThresh = Infinity

    // Manual iterative deepening with scene yields
    const stack: [number, number, number, string, number][] = [[START[0], START[1], 0, `threshold-${iter}`, 0]]
    const pathVisited = new Set<string>()

    while (stack.length > 0 && !found && nodeCounter < 30) {
      const [r, c, g, pid, tried] = stack[stack.length - 1]

      if (tried === 0) {
        const f = g + heuristic(r, c)
        if (f > threshold) {
          stack.pop()
          pathVisited.delete(`${r},${c}`)
          minNextThresh = Math.min(minNextThresh, f)
          continue
        }

        nodeCounter++
        const nodeId = `ida-${nodeCounter}`
        const node = mkNode(nodeId, `(${r},${c}) g=${g} f=${f}`, pid, COLORS.comparing)
        allNodes.set(nodeId, node)
        if (allNodes.get(pid)) {
          allNodes.get(pid)!.children.push(nodeId)
        }

        yield {
          objects: Array.from(allNodes.values()).map(n => ({ ...n, children: [...n.children] })),
          codeLine: 6,
          description: `IDA* 访问 (${r},${c})：g=${g}, h=${heuristic(r, c)}, f=${f} <= ${threshold}`,
        }

        if (r === END[0] && c === END[1]) {
          found = true
          node.color = COLORS.sorted
          break
        }
      }

      let expanded = false
      const dcStart = stack[stack.length - 1][4]
      for (let d = dcStart; d < dirs.length; d++) {
        const nr = r + dirs[d][0], nc = c + dirs[d][1]
        if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && grid[nr][nc] === 0 && !pathVisited.has(`${nr},${nc}`)) {
          pathVisited.add(`${nr},${nc}`)
          stack[stack.length - 1] = [r, c, g, pid, d + 1]
          stack.push([nr, nc, g + 1, `ida-${nodeCounter}`, 0])
          expanded = true
          break
        }
      }

      if (!expanded) {
        stack.pop()
        pathVisited.delete(`${r},${c}`)
      }
    }

    if (!found) {
      const oldThreshold = threshold
      threshold = minNextThresh
      if (threshold === Infinity) break

      yield {
        objects: Array.from(allNodes.values()).map(n => ({ ...n, children: [...n.children] })),
        codeLine: 10,
        description: `阈值 ${oldThreshold} 下未找到解，增大阈值至 ${threshold}`,
      }
    }
  }

  if (found) {
    const finalNodes = Array.from(allNodes.values()).map(n => ({
      ...n,
      color: n.color === COLORS.comparing ? COLORS.sorted : n.color,
      children: [...n.children],
    }))
    yield {
      objects: finalNodes,
      codeLine: 14,
      description: `IDA* 找到解！最终阈值=${threshold}，共生成 ${allNodes.size} 个搜索树节点`,
    }
  } else {
    yield {
      objects: Array.from(allNodes.values()).map(n => ({ ...n, children: [...n.children] })),
      codeLine: 14,
      description: `IDA* 搜索完成，未找到路径`,
    }
  }
}
