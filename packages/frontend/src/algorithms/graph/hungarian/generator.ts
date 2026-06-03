import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* hungarianGenerator(params: { size: number }): Generator<Scene> {
  const leftN = Math.min(params.size, 6)
  const rightN = leftN
  const totalN = leftN + rightN
  const adj: number[][] = Array.from({ length: leftN }, () => [])

  for (let i = 0; i < leftN; i++) {
    for (let j = 0; j < rightN; j++) {
      if (Math.random() < 0.5 || (i === j && Math.random() < 0.7)) adj[i].push(j)
    }
    if (adj[i].length === 0) adj[i].push(i % rightN)
  }

  const allEdges: GraphEdgeObject[] = []
  for (let u = 0; u < leftN; u++) {
    for (const v of adj[u]) {
      allEdges.push({
        kind: 'graphEdge', id: `e-${u}-${v + leftN}`, from: `n-${u}`, to: `n-${v + leftN}`,
        weight: 1, directed: false, color: '#cbd5e1',
      })
    }
  }

  const matchL: number[] = Array(leftN).fill(-1)
  const matchR: number[] = Array(rightN).fill(-1)
  let totalMatch = 0

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    const nodes: GraphNodeObject[] = []
    for (let i = 0; i < leftN; i++) {
      const lbl = matchL[i] !== -1 ? `L${i}↔R${matchL[i]}` : `L${i}`
      nodes.push({
        kind: 'graphNode' as const, id: `n-${i}`, label: lbl,
        color: states[i] || (matchL[i] !== -1 ? COLORS.sorted : COLORS.default),
      })
    }
    for (let j = 0; j < rightN; j++) {
      const lbl = matchR[j] !== -1 ? `R${j}↔L${matchR[j]}` : `R${j}`
      nodes.push({
        kind: 'graphNode' as const, id: `n-${j + leftN}`, label: lbl,
        color: states[j + leftN] || (matchR[j] !== -1 ? COLORS.sorted : COLORS.selected),
      })
    }
    return nodes
  }

  yield {
    objects: [...mkNodes({}), ...allEdges],
    codeLine: 1,
    description: `二分图：左部 ${leftN} 个节点，右部 ${rightN} 个节点，初始均未匹配`,
  }

  function* dfs(u: number, visited: boolean[]): Generator<Scene, boolean> {
    for (const v of adj[u]) {
      if (visited[v]) continue
      visited[v] = true

      yield {
        objects: [
          ...mkNodes({ [u]: COLORS.comparing, [v + leftN]: COLORS.highlight }),
          ...allEdges.map(e =>
            e.from === `n-${u}` && e.to === `n-${v + leftN}` ? { ...e, color: COLORS.highlight } : e
          ),
        ],
        codeLine: 2,
        description: `尝试匹配 L${u} → R${v}`,
      }

      if (matchR[v] === -1) {
        matchL[u] = v
        matchR[v] = u

        yield {
          objects: [
            ...mkNodes({ [u]: COLORS.sorted, [v + leftN]: COLORS.sorted }),
            ...allEdges.map(e => {
              const toIdx = parseInt(e.to.slice(2))
              return e.from === `n-${u}` && matchL[u] === toIdx - leftN ? { ...e, color: COLORS.sorted } : e
            }),
          ],
          codeLine: 3,
          description: `R${v} 未匹配，直接匹配 L${u} ↔ R${v}`,
        }
        return true
      }

      const prevU = matchR[v]

      yield {
        objects: [
          ...mkNodes({ [u]: COLORS.comparing, [v + leftN]: COLORS.highlight, [prevU]: COLORS.pivot }),
          ...allEdges.map(e =>
            e.from === `n-${prevU}` && e.to === `n-${v + leftN}` ? { ...e, color: COLORS.pivot } : e
          ),
        ],
        codeLine: 4,
        description: `R${v} 已被 L${prevU} 匹配，尝试为 L${prevU} 寻找新匹配`,
      }

      if (yield* dfs(prevU, visited)) {
        matchL[u] = v
        matchR[v] = u

        yield {
          objects: [
            ...mkNodes({ [u]: COLORS.sorted, [v + leftN]: COLORS.sorted }),
            ...allEdges.map(e => {
              const toIdx = parseInt(e.to.slice(2))
              return e.from === `n-${u}` && matchL[u] === toIdx - leftN ? { ...e, color: COLORS.sorted } : e
            }),
          ],
          codeLine: 5,
          description: `增广成功！更新 L${u} ↔ R${v}`,
        }
        return true
      }
    }
    return false
  }

  for (let u = 0; u < leftN; u++) {
    const visited = Array(rightN).fill(false)

    yield {
      objects: [
        ...mkNodes({ [u]: COLORS.highlight }),
        ...allEdges,
      ],
      codeLine: 6,
      description: `为 L${u} 启动增广路搜索`,
    }

    if (yield* dfs(u, visited)) totalMatch++
  }

  yield {
    objects: [
      ...mkNodes({}),
      ...allEdges.map(e => {
        const toIdx = parseInt(e.to.slice(2))
        const lIdx = parseInt(e.from.slice(2))
        return matchL[lIdx] === toIdx - leftN ? { ...e, color: COLORS.sorted } : { ...e, color: '#e2e8f0' }
      }),
    ],
    codeLine: 7,
    description: `匈牙利算法完成！最大匹配数 = ${totalMatch}`,
  }
}
