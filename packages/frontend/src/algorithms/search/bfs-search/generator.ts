import { COLORS, type Scene, type TreeNodeObject } from '@vsa/shared'

function mkNode(id: string, value: string | number, parentId: string | null, color: string, children: string[] = []): TreeNodeObject {
  return { kind: 'treeNode', id, value, parentId, children, color }
}

export default function* bfsSearch(params: { size: number }): Generator<Scene> {
  const N = params.size
  const grid: number[][] = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => (Math.random() < 0.25 ? 1 : 0))
  )
  grid[0][0] = 0
  grid[4][4] = 0

  const START = [0, 0]
  const END = [4, 4]
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]

  yield {
    objects: [mkNode('root', `起点(${START[0]},${START[1]})`, null, COLORS.highlight)],
    codeLine: 1,
    description: `BFS 搜索树构建开始，起点 (${START[0]},${START[1]}) → 终点 (${END[0]},${END[1]})`,
  }

  const queue: [number, number, string][] = [[START[0], START[1], 'root']]
  const visited = new Set<string>()
  visited.add(`${START[0]},${START[1]}`)
  const allNodes: TreeNodeObject[] = [mkNode('root', `起点(${START[0]},${START[1]})`, null, COLORS.highlight)]
  let nodeCounter = 0
  let found = false
  let foundId = ''

  let depth = 0
  while (queue.length > 0 && !found) {
    depth++
    const levelSize = queue.length
    const levelNodes: [number, number, string][] = []

    for (let l = 0; l < levelSize; l++) {
      const [r, c, pid] = queue.shift()!
      levelNodes.push([r, c, pid])

      if (r === END[0] && c === END[1]) {
        found = true
        foundId = pid
        break
      }
    }

    if (!found) {
      for (const [r, c, pid] of levelNodes) {
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && grid[nr][nc] === 0 && !visited.has(`${nr},${nc}`)) {
            visited.add(`${nr},${nc}`)
            nodeCounter++
            const childId = `n-${nodeCounter}`
            const childNode = mkNode(childId, `(${nr},${nc})`, pid, COLORS.default)
            allNodes.push(childNode)

            const parentNode = allNodes.find(n => n.id === pid)!
            parentNode.children.push(childId)
            parentNode.color = COLORS.pivot

            queue.push([nr, nc, childId])
          }
        }
      }

      if (depth <= 4) {
        const dispNodes = allNodes.map(n => ({ ...n, children: [...n.children] }))
        yield {
          objects: dispNodes,
          codeLine: 5,
          description: `BFS 第 ${depth} 层展开完成，队列大小=${queue.length}，已访问 ${visited.size} 个节点`,
        }
      }
    }
  }

  if (found) {
    const pathNodes = new Set<string>()
    let cur = foundId
    while (cur !== 'root' && cur !== '') {
      pathNodes.add(cur)
      const node = allNodes.find(n => n.id === cur)
      cur = node ? (node.parentId || 'root') : 'root'
    }

    const finalNodes = allNodes.map(n => ({
      ...n,
      color: pathNodes.has(n.id) ? COLORS.sorted : n.color,
      children: [...n.children],
    }))
    yield {
      objects: finalNodes,
      codeLine: 12,
      description: `BFS 搜索完成，找到终点！搜索树共 ${visited.size} 个节点`,
    }
  } else {
    yield {
      objects: allNodes.map(n => ({ ...n, children: [...n.children] })),
      codeLine: 12,
      description: `BFS 搜索完成，未找到路径`,
    }
  }
}
