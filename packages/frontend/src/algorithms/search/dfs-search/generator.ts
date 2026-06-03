import { COLORS, type Scene, type TreeNodeObject } from '@vsa/shared'

function mkNode(id: string, value: string | number, parentId: string | null, color: string, children: string[] = []): TreeNodeObject {
  return { kind: 'treeNode', id, value, parentId, children, color }
}

export default function* dfsSearch(params: { size: number }): Generator<Scene> {
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
    description: `DFS 搜索树构建开始，起点 (${START[0]},${START[1]}) → 终点 (${END[0]},${END[1]})`,
  }

  const visited = new Set<string>()
  const allNodes: TreeNodeObject[] = [mkNode('root', `起点(${START[0]},${START[1]})`, null, COLORS.highlight)]
  let nodeCounter = 0
  let found = false
  let foundId = ''
  let sceneCount = 0

  function dfs(r: number, c: number, parentId: string, depth: number): boolean {
    if (r === END[0] && c === END[1]) {
      found = true
      foundId = parentId
      return true
    }

    visited.add(`${r},${c}`)

    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && grid[nr][nc] === 0 && !visited.has(`${nr},${nc}`)) {
        nodeCounter++
        const childId = `n-${nodeCounter}`
        const childNode = mkNode(childId, `(${nr},${nc})`, parentId, COLORS.comparing)
        allNodes.push(childNode)

        const parentNode = allNodes.find(n => n.id === parentId)!
        parentNode.children.push(childId)
        parentNode.color = COLORS.pivot

        if (sceneCount < 30) {
          const dispNodes = allNodes.map(n => ({ ...n, children: [...n.children] }))
          // Do NOT yield here since we're not in a generator function
        }

        if (dfs(nr, nc, childId, depth + 1)) return true

        const backtrackNode = allNodes.find(n => n.id === childId)!
        backtrackNode.color = COLORS.inactive
      }
    }

    return false
  }

  // Non-recursive DFS with scene yields
  const stack: [number, number, string, number][] = [[START[0], START[1], 'root', 0]]
  visited.add(`${START[0]},${START[1]}`)

  while (stack.length > 0 && !found && sceneCount < 35) {
    const [r, c, pid, depth] = stack[stack.length - 1]
    const node = allNodes.find(n => n.id === pid)!

    const key = `${r},${c}`
    const exploredKey = `exp-${key}-${pid}`

    if (!visited.has(exploredKey)) {
      visited.add(exploredKey)
      sceneCount++

      node.color = COLORS.comparing
      yield {
        objects: allNodes.map(n => ({ ...n, children: [...n.children] })),
        codeLine: 4,
        description: `DFS 访问节点 (${r},${c})，深度=${depth}`,
      }

      if (r === END[0] && c === END[1]) {
        found = true
        foundId = pid
        break
      }
    }

    let expanded = false
    for (let d = 0; d < dirs.length; d++) {
      const nr = r + dirs[d][0], nc = c + dirs[d][1]
      const nk = `${nr},${nc}`
      if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && grid[nr][nc] === 0 && !visited.has(nk)) {
        visited.add(nk)
        nodeCounter++
        const childId = `n-${nodeCounter}`
        const childNode = mkNode(childId, `(${nr},${nc})`, pid, COLORS.highlight)
        allNodes.push(childNode)
        node.children.push(childId)

        sceneCount++
        yield {
          objects: allNodes.map(n => ({ ...n, children: [...n.children] })),
          codeLine: 6,
          description: `DFS 深入：从 (${r},${c}) 发现邻居 (${nr},${nc})`,
        }

        stack.push([nr, nc, childId, depth + 1])
        expanded = true
        break
      }
    }

    if (!expanded) {
      stack.pop()
      node.color = COLORS.inactive
      if (sceneCount < 35) {
        sceneCount++
        yield {
          objects: allNodes.map(n => ({ ...n, children: [...n.children] })),
          codeLine: 8,
          description: `DFS 回溯：节点 (${r},${c}) 无未访问邻居，回退`,
        }
      }
    }
  }

  if (found) {
    nodeCounter++
    const finalId = `n-${nodeCounter}`
    const finalNode = mkNode(finalId, `终点(${END[0]},${END[1]})`, foundId, COLORS.sorted)
    allNodes.push(finalNode)
    const parentNode = allNodes.find(n => n.id === foundId)!
    parentNode.children.push(finalId)

    const pathNodes = new Set<string>()
    let cur = foundId
    while (cur !== 'root' && cur !== '') {
      pathNodes.add(cur)
      const nd = allNodes.find(n => n.id === cur)
      cur = nd ? (nd.parentId || 'root') : 'root'
    }

    const finalNodes = allNodes.map(n => ({
      ...n,
      color: pathNodes.has(n.id) ? COLORS.sorted : (foundId === n.id ? COLORS.sorted : n.color),
      children: [...n.children],
    }))
    yield {
      objects: finalNodes,
      codeLine: 12,
      description: `DFS 找到终点！搜索树共 ${visited.size} 个访问状态`,
    }
  } else {
    yield {
      objects: allNodes.map(n => ({ ...n, children: [...n.children] })),
      codeLine: 12,
      description: `DFS 搜索完成，未找到路径`,
    }
  }
}
