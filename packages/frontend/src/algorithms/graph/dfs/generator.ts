import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 6
  // 图邻接表: 0-1,0-2, 1-3,1-4, 2-4, 3-5, 4-5
  const graph: number[][] = [
    [1, 2],
    [0, 3, 4],
    [0, 4],
    [1, 5],
    [1, 2, 5],
    [3, 4],
  ]

  let visited: boolean[] = Array(size).fill(false)
  let order: number[] = Array(size).fill(-1)
  let time = 0
  const stack: number[] = []

  yield {
    description: '初始化：visited 数组全部置为 false，发现顺序（order）全部置为 -1',
    codeLine: 1,
    objects: order.map((v, i) => mkBar(`n${i}`, 0, i, '#6b7280', `节点${i}`)),
  }

  // DFS from node 0
  function* dfs(u: number): Generator<Scene> {
    visited[u] = true
    order[u] = time++
    stack.push(u)

    yield {
      description: `访问节点 ${u}，标记为已访问，发现顺序 = ${order[u]}。当前栈：[${stack.join(', ')}]`,
      codeLine: 2,
      objects: order.map((v, i) =>
        mkBar(`n${i}`, v === -1 ? 0 : v + 1, i,
          i === u ? '#ef4444' : visited[i] ? '#3b82f6' : '#6b7280',
          `节点${i}`)
      ),
    }

    for (const v of graph[u]) {
      if (!visited[v]) {
        yield {
          description: `从节点 ${u} 深入，发现未访问的邻居节点 ${v}`,
          codeLine: 3,
          objects: order.map((ov, i) =>
            mkBar(`n${i}`, ov === -1 ? 0 : ov + 1, i,
              i === v ? '#f59e0b' : i === u ? '#ef4444' : visited[i] ? '#3b82f6' : '#6b7280',
              `节点${i}`)
          ),
        }

        yield* dfs(v)

        yield {
          description: `节点 ${v} 及其子树遍历完毕，回溯到节点 ${u}`,
          codeLine: 4,
          objects: order.map((ov, i) =>
            mkBar(`n${i}`, ov === -1 ? 0 : ov + 1, i,
              i === u ? '#ef4444' : visited[i] ? '#10b981' : '#6b7280',
              `节点${i}`)
          ),
        }
      } else {
        yield {
          description: `节点 ${v} 已经被访问过（顺序 = ${order[v]}），跳过`,
          codeLine: 5,
          objects: order.map((ov, i) =>
            mkBar(`n${i}`, ov === -1 ? 0 : ov + 1, i,
              visited[i] ? '#3b82f6' : '#6b7280', `节点${i}`)
          ),
        }
      }
    }

    stack.pop()
    yield {
      description: `节点 ${u} 完成，从栈中弹出。当前栈：[${stack.join(', ') || '空'}]`,
      codeLine: 6,
      objects: order.map((ov, i) =>
        mkBar(`n${i}`, ov === -1 ? 0 : ov + 1, i,
          visited[i] ? '#10b981' : '#6b7280', `节点${i}`)
      ),
    }
  }

  yield* dfs(0)

  // Check for remaining unvisited nodes
  for (let i = 1; i < size; i++) {
    if (!visited[i]) {
      yield {
        description: `发现未访问的节点 ${i}（可能是不连通分量），继续 DFS`,
        codeLine: 7,
        objects: order.map((ov, j) =>
          mkBar(`n${j}`, ov === -1 ? 0 : ov + 1, j,
            j === i ? '#f59e0b' : visited[j] ? '#10b981' : '#6b7280', `节点${j}`)
        ),
      }
      yield* dfs(i)
    }
  }

  yield {
    description: 'DFS 完成！所有节点遍历完毕，order 数组记录了各节点的发现顺序',
    codeLine: 8,
    objects: order.map((v, i) =>
      mkBar(`n${i}`, v + 1, i, '#10b981', `节点${i}`)
    ),
  }
}
