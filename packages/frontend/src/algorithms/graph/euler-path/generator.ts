import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 5
  // 无向图邻接表（存在欧拉回路）
  const graph: number[][] = [
    [1, 2, 3],
    [0, 2],
    [0, 1, 3, 4],
    [0, 2, 4],
    [2, 3],
  ]

  let degree: number[] = graph.map(adj => adj.length)

  yield {
    description: '初始化：计算每个节点的度数。欧拉路径存在条件：最多 2 个奇数度节点',
    codeLine: 1,
    objects: degree.map((d, i) =>
      mkBar(`n${i}`, d * 3, i, '#3b82f6',
        d % 2 === 0 ? `节点${i}(偶:${d})` : `节点${i}(奇:${d})`)
    ),
  }

  const oddNodes = degree.map((d, i) => d % 2 !== 0 ? i : -1).filter(i => i !== -1)

  if (oddNodes.length > 2) {
    yield {
      description: `奇数度节点数 = ${oddNodes.length} > 2，不存在欧拉路径！`,
      codeLine: 2,
      objects: degree.map((d, i) =>
        mkBar(`n${i}`, d * 3, i,
          d % 2 !== 0 ? '#ef4444' : '#10b981', `节点${i}`)
      ),
    }
  } else {
    yield {
      description: `奇数度节点数 = ${oddNodes.length} ≤ 2，${oddNodes.length === 0 ? '存在欧拉回路' : `存在欧拉路径（以节点 ${oddNodes[0]} 为起点）`}`,
      codeLine: 2,
      objects: degree.map((d, i) =>
        mkBar(`n${i}`, d * 3, i,
          d % 2 !== 0 ? '#f59e0b' : '#10b981', `节点${i}`)
      ),
    }

    // Hierholzer 算法
    const start = oddNodes.length > 0 ? oddNodes[0] : 0
    const adjCopy: number[][] = graph.map(adj => [...adj])
    const path: number[] = []
    const stack: number[] = [start]

    yield {
      description: `Hierholzer 算法开始：从节点 ${start} 出发。当前栈：[${start}]`,
      codeLine: 3,
      objects: degree.map((d, i) =>
        mkBar(`n${i}`, d * 3, i,
          i === start ? '#ef4444' : d % 2 !== 0 ? '#f59e0b' : '#10b981', `节点${i}`)
      ),
    }

    while (stack.length > 0) {
      const u = stack[stack.length - 1]

      if (adjCopy[u].length > 0) {
        const v = adjCopy[u].pop()!
        // 从 v 的邻接表中移除 u
        const vi = adjCopy[v].indexOf(u)
        if (vi !== -1) adjCopy[v].splice(vi, 1)

        stack.push(v)

        const remainingDeg = adjCopy.map(a => a.length)

        yield {
          description: `从节点 ${u} 走到节点 ${v}，入栈。边 (${u}, ${v}) 已删除。栈：[${stack.join(', ')}]`,
          codeLine: 4,
          objects: remainingDeg.map((d, i) =>
            mkBar(`n${i}`, d * 3, i,
              i === v ? '#ef4444' : stack.includes(i) ? '#3b82f6' : '#6b7280',
              `节点${i}(剩${d}边)`)
          ),
        }
      } else {
        const w = stack.pop()!
        path.push(w)

        const remainingDeg = adjCopy.map(a => a.length)

        yield {
          description: `节点 ${u} 无边可走，出栈并加入路径 → [${path.join(', ')}]`,
          codeLine: 5,
          objects: remainingDeg.map((d, i) =>
            mkBar(`n${i}`, d * 3, i,
              path.includes(i) ? '#10b981' : stack.includes(i) ? '#3b82f6' : '#6b7280',
              `节点${i}`)
          ),
        }
      }
    }

    yield {
      description: `Hierholzer 算法完成！欧拉路径/回路：[${path.join(' → ')}]`,
      codeLine: 6,
      objects: path.map((node, i) =>
        mkBar(`p${i}`, node + 1, i, '#10b981', `第${i + 1}步:${node}`)
      ),
    }
  }
}
