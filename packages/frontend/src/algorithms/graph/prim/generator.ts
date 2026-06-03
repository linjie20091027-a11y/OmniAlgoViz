import type { Scene, GraphNodeObject, GraphEdgeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* primGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 10)
  const adj: number[][] = Array.from({ length: n }, () => [])
  const weight: Record<string, number> = {}

  // 构建随机加权连通图
  for (let i = 1; i < n; i++) {
    const parent = Math.floor(Math.random() * i)
    adj[parent].push(i)
    adj[i].push(parent)
    const wkey = parent < i ? `${parent}-${i}` : `${i}-${parent}`
    weight[wkey] = Math.floor(Math.random() * 9) + 1
  }
  for (let i = 0; i < Math.floor(n * 1.5); i++) {
    const u = Math.floor(Math.random() * n)
    const v = Math.floor(Math.random() * n)
    if (u !== v && !adj[u].includes(v)) {
      adj[u].push(v)
      adj[v].push(u)
      const wkey = u < v ? `${u}-${v}` : `${v}-${u}`
      weight[wkey] = Math.floor(Math.random() * 9) + 1
    }
  }

  const edgeSet = new Set<string>()
  const allEdges: GraphEdgeObject[] = []
  for (let u = 0; u < n; u++) {
    for (const v of adj[u]) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        allEdges.push({
          kind: 'graphEdge', id: `e-${u}-${v}`, from: `n-${u}`, to: `n-${v}`,
          weight: weight[key], directed: false, color: '#cbd5e1',
        })
      }
    }
  }

  function mkNodes(states: Record<number, string>): GraphNodeObject[] {
    return Array.from({ length: n }, (_, i) => {
      const k = key[i]
      const lbl = k === INF ? `${i}(INF)` : `${i}(${k})`
      return {
        kind: 'graphNode' as const,
        id: `n-${i}`,
        label: lbl,
        color: states[i] || COLORS.default,
      }
    })
  }

  function getEdgeId(a: number, b: number): string {
    return `e-${a}-${b}`
  }

  const INF = 999
  const key: number[] = new Array(n).fill(INF)
  const inMST: boolean[] = new Array(n).fill(false)
  const parent: number[] = new Array(n).fill(-1)
  key[0] = 0
  const mstEdgeKeys: Set<string> = new Set()

  yield {
    objects: [...mkNodes({ 0: COLORS.sorted }), ...allEdges],
    codeLine: 1,
    description: `初始化：任选节点 0 作为 MST 起点，key[0]=0，其余 key=INF`,
  }

  for (let iter = 0; iter < n; iter++) {
    let u = -1
    let minKey = INF
    for (let i = 0; i < n; i++) {
      if (!inMST[i] && key[i] < minKey) {
        u = i
        minKey = key[i]
      }
    }
    if (u === -1) break

    yield {
      objects: [
        ...mkNodes({ [u]: COLORS.comparing }),
        ...allEdges.map(e =>
          (mstEdgeKeys.has(getEdgeId(e.from === `n-${u}` ? u : parseInt(e.from.slice(2)), e.to === `n-${u}` ? u : parseInt(e.to.slice(2)))))
            ? { ...e, color: COLORS.sorted }
            : e
        ),
      ],
      codeLine: 3,
      description: `选择 key 最小的未加入节点：${u}（key=${minKey}），将其加入 MST`,
    }

    inMST[u] = true
    if (parent[u] !== -1) {
      const p = parent[u]
      mstEdgeKeys.add(getEdgeId(u, p))
      mstEdgeKeys.add(getEdgeId(p, u))
    }

    yield {
      objects: [
        ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => inMST[i] ? [i, COLORS.sorted] : [i, null] as const).filter(([, v]) => v !== null) as [number, string][])),
        ...allEdges.map(e => {
          const fromIdx = parseInt(e.from.slice(2))
          const toIdx = parseInt(e.to.slice(2))
          return mstEdgeKeys.has(getEdgeId(fromIdx, toIdx)) ? { ...e, color: COLORS.sorted } : e
        }),
      ],
      codeLine: 4,
      description: parent[u] === -1 ? `节点 ${u} 作为 MST 起点` : `将边 (${parent[u]}, ${u}) 权重 ${key[u]} 加入 MST`,
    }

    // 更新相邻节点的 key
    for (const v of adj[u]) {
      if (inMST[v]) continue
      const wkey = u < v ? `${u}-${v}` : `${v}-${u}`
      const w = weight[wkey]
      if (w < key[v]) {
        const oldKey = key[v]
        key[v] = w
        parent[v] = u

        yield {
          objects: [
            ...mkNodes({ [u]: COLORS.sorted, [v]: COLORS.highlight }),
            ...allEdges.map(e =>
              mstEdgeKeys.has(getEdgeId(parseInt(e.from.slice(2)), parseInt(e.to.slice(2))))
                ? { ...e, color: COLORS.sorted }
                : (e.from === `n-${u}` && e.to === `n-${v}`) || (e.from === `n-${v}` && e.to === `n-${u}`)
                  ? { ...e, color: COLORS.comparing }
                  : e
            ),
          ],
          codeLine: 5,
          description: `更新节点 ${v} 的 key：${oldKey === INF ? 'INF' : oldKey} → ${w}（发现更短的边 (${u},${v})），parent[${v}] = ${u}`,
        }
      }
    }
  }

  yield {
    objects: [
      ...mkNodes(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, COLORS.sorted]))),
      ...allEdges.map(e =>
        mstEdgeKeys.has(getEdgeId(parseInt(e.from.slice(2)), parseInt(e.to.slice(2))))
          ? { ...e, color: COLORS.sorted }
          : { ...e, color: '#e2e8f0' }
      ),
    ],
    codeLine: 7,
    description: `Prim 完成！MST 已构建，包含 ${n - 1} 条边，总权重 = ${key.reduce((a, b) => a + b, 0)}`,
  }
}
