import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 6
  // 有向图邻接表
  const graph: number[][] = [
    [1],
    [2, 4],
    [3, 0],
    [5],
    [5],
    [4],
  ]

  let index = 0
  let time = 0
  const lowlink: number[] = Array(size).fill(-1)
  const indexArr: number[] = Array(size).fill(-1)
  const onStack: boolean[] = Array(size).fill(false)
  const stack: number[] = []
  const sccId: number[] = Array(size).fill(-1)
  let sccCount = 0

  yield {
    description: '初始化：index 数组和 lowlink 数组全部置为 -1，栈为空',
    codeLine: 1,
    objects: indexArr.map((_, i) =>
      mkBar(`n${i}`, 0, i, '#6b7280', `节点${i}`)
    ),
  }

  function* strongconnect(v: number): Generator<Scene> {
    indexArr[v] = index
    lowlink[v] = index
    index++
    stack.push(v)
    onStack[v] = true

    yield {
      description: `访问节点 ${v}：index = ${indexArr[v]}，lowlink = ${lowlink[v]}，压入栈 → [${stack.join(', ')}]`,
      codeLine: 2,
      objects: indexArr.map((_, i) =>
        mkBar(`n${i}`, lowlink[i] === -1 ? 0 : lowlink[i] + 1, i,
          i === v ? '#ef4444' : onStack[i] ? '#3b82f6' : indexArr[i] !== -1 ? '#10b981' : '#6b7280',
          `节点${i}`)
      ),
    }

    for (const w of graph[v]) {
      if (indexArr[w] === -1) {
        yield {
          description: `从节点 ${v} 深入到邻居 ${w}，递归调用 strongconnect(${w})`,
          codeLine: 3,
          objects: indexArr.map((_, i) =>
            mkBar(`n${i}`, lowlink[i] === -1 ? 0 : lowlink[i] + 1, i,
              i === w ? '#f59e0b' : i === v ? '#ef4444' : '#3b82f6',
              `节点${i}`)
          ),
        }

        yield* strongconnect(w)

        lowlink[v] = Math.min(lowlink[v], lowlink[w])
        yield {
          description: `回溯到节点 ${v}：lowlink[${v}] = min(${lowlink[v]}, lowlink[${w}] = ${lowlink[w]}) = ${lowlink[v]}`,
          codeLine: 4,
          objects: indexArr.map((_, i) =>
            mkBar(`n${i}`, lowlink[i] === -1 ? 0 : lowlink[i] + 1, i,
              i === v ? '#ef4444' : '#3b82f6',
              `节点${i}`)
          ),
        }
      } else if (onStack[w]) {
        lowlink[v] = Math.min(lowlink[v], indexArr[w])
        yield {
          description: `节点 ${w} 在栈中（回边），更新 lowlink[${v}] = min(${lowlink[v]}, index[${w}] = ${indexArr[w]}) = ${lowlink[v]}`,
          codeLine: 5,
          objects: indexArr.map((_, i) =>
            mkBar(`n${i}`, lowlink[i] === -1 ? 0 : lowlink[i] + 1, i,
              i === w ? '#f59e0b' : '#3b82f6',
              `节点${i}`)
          ),
        }
      }
    }

    if (lowlink[v] === indexArr[v]) {
      yield {
        description: `节点 ${v} 是 SCC 根节点（lowlink = index = ${lowlink[v]}），开始弹出栈构成第 ${sccCount + 1} 个分量`,
        codeLine: 6,
        objects: indexArr.map((_, i) =>
          mkBar(`n${i}`, lowlink[i] === -1 ? 0 : lowlink[i] + 1, i,
            i === v ? '#ef4444' : onStack[i] ? '#3b82f6' : '#10b981',
            `节点${i}`)
        ),
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
        description: `强连通分量 #${sccCount}：[${comp.join(', ')}]。栈剩余：[${stack.join(', ') || '空'}]`,
        codeLine: 7,
        objects: indexArr.map((_, i) =>
          mkBar(`n${i}`, sccId[i] + 1, i,
            sccId[i] !== -1 ? '#10b981' : lowlink[i] !== -1 ? '#3b82f6' : '#6b7280',
            sccId[i] !== -1 ? `节点${i}(SCC${sccId[i] + 1})` : `节点${i}`)
        ),
      }
    }
  }

  for (let i = 0; i < size; i++) {
    if (indexArr[i] === -1) {
      yield {
        description: `节点 ${i} 尚未访问，从该节点启动 DFS`,
        codeLine: 8,
        objects: indexArr.map((_, j) =>
          mkBar(`n${j}`, 0, j,
            j === i ? '#f59e0b' : indexArr[j] !== -1 ? '#10b981' : '#6b7280',
            `节点${j}`)
        ),
      }
      yield* strongconnect(i)
    }
  }

  yield {
    description: `Tarjan 算法完成！共找到 ${sccCount} 个强连通分量`,
    codeLine: 9,
    objects: sccId.map((v, i) =>
      mkBar(`n${i}`, v + 1, i, '#10b981', `节点${i}(SCC${v + 1})`)
    ),
  }
}
