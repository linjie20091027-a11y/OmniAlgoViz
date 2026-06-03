import { COLORS, type Scene, type TreeNodeObject } from '@vsa/shared'

function mkNode(id: string, value: string | number, parentId: string | null, color: string, children: string[] = []): TreeNodeObject {
  return { kind: 'treeNode', id, value, parentId, children, color }
}

export default function* aStarSearch(params: { size: number }): Generator<Scene> {
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
    objects: [mkNode('root', `起点(${START[0]},${START[1]}) g=0 h=${heuristic(0, 0)} f=${heuristic(0, 0)}`, null, COLORS.highlight)],
    codeLine: 1,
    description: `A* 搜索：f(n) = g(n) + h(n)，起点(${START[0]},${START[1]})，终点(${END[0]},${END[1]})`,
  }

  const allNodes: TreeNodeObject[] = [mkNode('root', `起点 g=0 h=${heuristic(0, 0)} f=${heuristic(0, 0)}`, null, COLORS.highlight)]
  const gScore = new Map<string, number>()
  gScore.set('root', 0)

  interface PQItem { id: string, r: number, c: number, f: number }
  const pq: PQItem[] = [{ id: 'root', r: START[0], c: START[1], f: heuristic(START[0], START[1]) }]
  const visited = new Set<string>()
  let nodeCounter = 0
  let found = false

  while (pq.length > 0 && !found && nodeCounter < 30) {
    pq.sort((a, b) => a.f - b.f)
    const { id, r, c } = pq.shift()!

    if (visited.has(`${r},${c}`)) continue
    visited.add(`${r},${c}`)

    const g = gScore.get(id) || 0
    const node = allNodes.find(n => n.id === id)!
    node.color = COLORS.comparing

    yield {
      objects: allNodes.map(n => ({ ...n, children: [...n.children] })),
      codeLine: 5,
      description: `A* 取出 f 最小的节点 (${r},${c})：g=${g}, h=${heuristic(r, c)}, f=${g + heuristic(r, c)}`,
    }

    if (r === END[0] && c === END[1]) {
      found = true
      node.color = COLORS.sorted
      break
    }

    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && grid[nr][nc] === 0 && !visited.has(`${nr},${nc}`)) {
        nodeCounter++
        const childId = `n-${nodeCounter}`
        const newG = g + 1
        const h = heuristic(nr, nc)
        const f = newG + h
        gScore.set(childId, newG)

        const childNode = mkNode(childId, `(${nr},${nc}) g=${newG} h=${h} f=${f}`, id, COLORS.highlight)
        allNodes.push(childNode)
        node.children.push(childId)

        pq.push({ id: childId, r: nr, c: nc, f })
      }
    }

    node.color = COLORS.sorted
    yield {
      objects: allNodes.map(n => ({ ...n, children: [...n.children] })),
      codeLine: 8,
      description: `节点 (${r},${c}) 扩展完成，优先队列大小=${pq.length}`,
    }
  }

  if (found) {
    const finalNodes = allNodes.map(n => ({ ...n, color: COLORS.sorted, children: [...n.children] }))
    yield {
      objects: finalNodes,
      codeLine: 14,
      description: `A* 找到最优路径！共扩展 ${allNodes.length} 个节点`,
    }
  } else {
    yield {
      objects: allNodes.map(n => ({ ...n, children: [...n.children] })),
      codeLine: 14,
      description: `A* 搜索完成，未找到路径`,
    }
  }
}
