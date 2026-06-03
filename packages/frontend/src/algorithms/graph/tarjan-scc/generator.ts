import { COLORS, type Scene, type GraphNodeObject, type GraphEdgeObject } from '@vsa/shared'

export default function* tarjanGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 8)
  const adj: number[][] = Array.from({ length: n }, () => [])

  for (let i = 1; i < n; i++) {
    const parent = Math.floor(Math.random() * i)
    adj[parent].push(i)
  }
  for (let i = 0; i < Math.floor(n * 1.3); i++) {
    const u = Math.floor(Math.random() * n)
    const v = Math.floor(Math.random() * n)
    if (u !== v && !adj[u].includes(v)) adj[u].push(v)
  }

  const allEdges: GraphEdgeObject[] = []
  for (let u = 0; u < n; u++) {
    for (const v of adj[u]) {
      allEdges.push({
        kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`,
        weight: 1, directed: true, color: '#cbd5e1',
      })
    }
  }

  const indexArr: number[] = Array(n).fill(-1)
  const lowlink: number[] = Array(n).fill(-1)
  const onStack: boolean[] = Array(n).fill(false)
  const stack: number[] = []
  const sccId: number[] = Array(n).fill(-1)
  let timer = 0
  let sccCount = 0

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => ({
      kind: 'graphNode' as const,
      id: `n-${i}`,
      label: indexArr[i] === -1 ? `${i}` : `${i}(idx${indexArr[i]},low${lowlink[i]})`,
      color: states[i] || (sccId[i] !== -1 ? COLORS.sorted : COLORS.default),
    }))
  }

  yield {
    objects: [...mkNodes({}), ...allEdges],
    codeLine: 1,
    description: `初始化：${n} 个节点的有向图。index 和 lowlink 均置为 -1`,
  }

  function* strongconnect(v: number): Generator<Scene> {
    indexArr[v] = timer
    lowlink[v] = timer
    timer++
    stack.push(v)
    onStack[v] = true

    yield {
      objects: [
        ...mkNodes({ [v]: COLORS.comparing }),
        ...allEdges,
      ],
      codeLine: 2,
      description: `访问节点 ${v}：index=${indexArr[v]}，lowlink=${lowlink[v]}，栈：[${stack.join(', ')}]`,
    }

    for (const w of adj[v]) {
      if (indexArr[w] === -1) {
        yield {
          objects: [
            ...mkNodes({ [v]: COLORS.comparing, [w]: COLORS.highlight }),
            ...allEdges.map(e => (e.from === `n-${v}` && e.to === `n-${w}`) ? { ...e, color: COLORS.highlight } : e),
          ],
          codeLine: 3,
          description: `从节点 ${v} 沿边 (${v}→${w}) 深入，递归调用`,
        }
        yield* strongconnect(w)
        lowlink[v] = Math.min(lowlink[v], lowlink[w])

        yield {
          objects: [
            ...mkNodes({ [v]: COLORS.comparing }),
            ...allEdges,
          ],
          codeLine: 4,
          description: `回溯到 ${v}：lowlink[${v}] = min(${lowlink[v]}, ${lowlink[w]}) = ${lowlink[v]}`,
        }
      } else if (onStack[w]) {
        lowlink[v] = Math.min(lowlink[v], indexArr[w])

        yield {
          objects: [
            ...mkNodes({ [v]: COLORS.comparing, [w]: COLORS.highlight }),
            ...allEdges.map(e => (e.from === `n-${v}` && e.to === `n-${w}`) ? { ...e, color: COLORS.highlight } : e),
          ],
          codeLine: 5,
          description: `${w} 在栈中（回边），更新 lowlink[${v}] = min(${lowlink[v]}, index[${w}]=${indexArr[w]}) = ${lowlink[v]}`,
        }
      }
    }

    if (lowlink[v] === indexArr[v]) {
      yield {
        objects: [
          ...mkNodes({ [v]: COLORS.pivot }),
          ...allEdges,
        ],
        codeLine: 6,
        description: `节点 ${v} 是 SCC 根（lowlink=index=${lowlink[v]}），开始弹栈构成分量`,
      }

      const comp: number[] = []
      let w: number
      do {
        w = stack.pop()!
        onStack[w] = false
        sccId[w] = sccCount
        comp.push(w)
      } while (w !== v)

      sccCount++

      yield {
        objects: [
          ...mkNodes(Object.fromEntries(comp.map(c => [c, COLORS.sorted]))),
          ...allEdges.map(e => {
            const from = parseInt(e.from.slice(2)), to = parseInt(e.to.slice(2))
            return sccId[from] === sccId[to] && sccId[from] !== -1 ? { ...e, color: COLORS.sorted } : e
          }),
        ],
        codeLine: 7,
        description: `SCC #${sccCount}：[${comp.join(', ')}]，栈剩余：[${stack.join(', ') || '空'}]`,
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (indexArr[i] === -1) {
      yield {
        objects: [...mkNodes({ [i]: COLORS.highlight }), ...allEdges],
        codeLine: 8,
        description: `节点 ${i} 未访问，启动新 DFS`,
      }
      yield* strongconnect(i)
    }
  }

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
      ...allEdges.map(e => {
        const from = parseInt(e.from.slice(2)), to = parseInt(e.to.slice(2))
        return sccId[from] === sccId[to] ? { ...e, color: COLORS.sorted } : { ...e, color: '#e2e8f0' }
      }),
    ],
    codeLine: 9,
    description: `Tarjan 完成！共 ${sccCount} 个强连通分量`,
  }
}
