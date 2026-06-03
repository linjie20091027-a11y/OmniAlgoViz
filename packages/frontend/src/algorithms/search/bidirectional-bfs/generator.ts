import { COLORS, type Scene, type TreeNodeObject } from '@vsa/shared'

function mkNode(id: string, value: string | number, parentId: string | null, color: string, children: string[] = []): TreeNodeObject {
  return { kind: 'treeNode', id, value, parentId, children, color }
}

export default function* biBfsSearch(params: { size: number }): Generator<Scene> {
  const N = params.size
  const grid: number[][] = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => (Math.random() < 0.22 ? 1 : 0))
  )
  grid[0][0] = 0
  grid[4][4] = 0

  const START = [0, 0]
  const END = [4, 4]
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]

  yield {
    objects: [
      mkNode('fwd-root', `正向起点(${START[0]},${START[1]})`, null, COLORS.highlight),
      mkNode('bwd-root', `反向起点(${END[0]},${END[1]})`, null, COLORS.pivot),
    ],
    codeLine: 1,
    description: `双向BFS：正向从起点(${START[0]},${START[1]})，反向从终点(${END[0]},${END[1]}) 同时搜索`,
  }

  const fwdVisited = new Set<string>()
  const bwdVisited = new Set<string>()
  fwdVisited.add(`${START[0]},${START[1]}`)
  bwdVisited.add(`${END[0]},${END[1]}`)

  const fwdQueue: [number, number, string][] = [[START[0], START[1], 'fwd-root']]
  const bwdQueue: [number, number, string][] = [[END[0], END[1], 'bwd-root']]

  const fwdNodes: TreeNodeObject[] = [mkNode('fwd-root', `正向(${START[0]},${START[1]})`, null, COLORS.highlight)]
  const bwdNodes: TreeNodeObject[] = [mkNode('bwd-root', `反向(${END[0]},${END[1]})`, null, COLORS.pivot)]

  let fwdCounter = 0
  let bwdCounter = 0
  let meetNode = ''
  let found = false

  yield {
    objects: [...fwdNodes, ...bwdNodes],
    codeLine: 2,
    description: `初始化：正向队列=[起点]，反向队列=[终点]`,
  }

  while (fwdQueue.length > 0 && bwdQueue.length > 0 && !found) {
    const fwdLevelSize = Math.min(fwdQueue.length, 3)

    for (let l = 0; l < fwdLevelSize && !found; l++) {
      const [r, c, pid] = fwdQueue.shift()!

      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc
        if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && grid[nr][nc] === 0 && !fwdVisited.has(`${nr},${nc}`)) {
          fwdVisited.add(`${nr},${nc}`)
          fwdCounter++
          const childId = `fwd-${fwdCounter}`
          const childNode = mkNode(childId, `正向(${nr},${nc})`, pid, COLORS.highlight)
          fwdNodes.push(childNode)

          const pNode = fwdNodes.find(n => n.id === pid)!
          pNode.children.push(childId)
          pNode.color = COLORS.pivot

          fwdQueue.push([nr, nc, childId])

          if (bwdVisited.has(`${nr},${nc}`)) {
            found = true
            meetNode = childId
            break
          }
        }
      }
    }

    if (found) break

    yield {
      objects: [...fwdNodes, ...bwdNodes].map(n => ({ ...n, children: [...n.children] })),
      codeLine: 5,
      description: `正向扩展一轮，正向树 ${fwdNodes.length} 个节点`,
    }

    const bwdLevelSize = Math.min(bwdQueue.length, 3)
    for (let l = 0; l < bwdLevelSize && !found; l++) {
      const [r, c, pid] = bwdQueue.shift()!

      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc
        if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && grid[nr][nc] === 0 && !bwdVisited.has(`${nr},${nc}`)) {
          bwdVisited.add(`${nr},${nc}`)
          bwdCounter++
          const childId = `bwd-${bwdCounter}`
          const childNode = mkNode(childId, `反向(${nr},${nc})`, pid, COLORS.pivot)
          bwdNodes.push(childNode)

          const pNode = bwdNodes.find(n => n.id === pid)!
          pNode.children.push(childId)
          pNode.color = COLORS.pivot

          bwdQueue.push([nr, nc, childId])

          if (fwdVisited.has(`${nr},${nc}`)) {
            found = true
            meetNode = childId
            break
          }
        }
      }
    }

    yield {
      objects: [...fwdNodes, ...bwdNodes].map(n => ({ ...n, children: [...n.children] })),
      codeLine: 8,
      description: `反向扩展一轮，反向树 ${bwdNodes.length} 个节点。正向=${fwdVisited.size}，反向=${bwdVisited.size}`,
    }
  }

  if (found) {
    const meetCoord = meetNode.startsWith('fwd-')
      ? fwdNodes.find(n => n.id === meetNode)?.value?.toString().match(/\((\d),(\d)\)/)
      : bwdNodes.find(n => n.id === meetNode)?.value?.toString().match(/\((\d),(\d)\)/)

    const allNodes = [...fwdNodes, ...bwdNodes].map(n => ({
      ...n,
      color: n.id === meetNode ? COLORS.sorted : n.color,
      children: [...n.children],
    }))

    yield {
      objects: allNodes,
      codeLine: 14,
      description: `双向BFS 在中间相遇！正向树=${fwdNodes.length}，反向树=${bwdNodes.length}，总=${allNodes.length}`,
    }
  } else {
    yield {
      objects: [...fwdNodes, ...bwdNodes].map(n => ({ ...n, children: [...n.children] })),
      codeLine: 14,
      description: `双向BFS 完成，未找到路径`,
    }
  }
}
