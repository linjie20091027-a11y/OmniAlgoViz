import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 6
  // 有向无环图邻接表
  const graph: number[][] = [
    [1, 2],
    [3, 4],
    [3],
    [5],
    [5],
    [],
  ]

  // 计算入度
  let indegree: number[] = Array(size).fill(0)
  for (let u = 0; u < size; u++) {
    for (const v of graph[u]) {
      indegree[v]++
    }
  }

  yield {
    description: '初始化：计算每个节点的入度。入度为 0 的节点可以作为拓扑排序的起点',
    codeLine: 1,
    objects: indegree.map((v, i) =>
      mkBar(`n${i}`, v * 5, i, '#3b82f6', `节点${i}(入度:${v})`)
    ),
  }

  // 找出所有入度为 0 的节点
  const queue: number[] = []
  for (let i = 0; i < size; i++) {
    if (indegree[i] === 0) queue.push(i)
  }

  yield {
    description: `入度为 0 的节点加入队列：[${queue.join(', ')}]。这些节点可以立即输出`,
    codeLine: 2,
    objects: indegree.map((v, i) =>
      mkBar(`n${i}`, v * 5, i,
        v === 0 ? '#10b981' : '#3b82f6',
        `节点${i}(入度:${v})`)
    ),
  }

  let result: number[] = []
  let order = 0

  while (queue.length > 0) {
    const u = queue.shift()!
    result.push(u)
    order++

    yield {
      description: `从队列取出节点 ${u}，输出到排序结果 [${result.join(', ')}]（第 ${order} 个）`,
      codeLine: 3,
      objects: indegree.map((v, i) =>
        mkBar(`n${i}`, v * 5, i,
          i === u ? '#ef4444' : i === 0 && result.includes(i) ? '#10b981' : v === 0 ? '#10b981' : '#3b82f6',
          result.includes(i) ? `节点${i}(✓)` : `节点${i}(入度:${v})`)
      ),
    }

    for (const v of graph[u]) {
      indegree[v]--

      yield {
        description: `删除节点 ${u} 的出边 (${u} → ${v})，节点 ${v} 入度减 1：${indegree[v] + 1} → ${indegree[v]}`,
        codeLine: 4,
        objects: indegree.map((d, i) =>
          mkBar(`n${i}`, d * 5, i,
            i === v ? '#f59e0b' : result.includes(i) ? '#10b981' : '#3b82f6',
            `节点${i}(入度:${d})`)
        ),
      }

      if (indegree[v] === 0) {
        queue.push(v)

        yield {
          description: `节点 ${v} 入度降为 0，加入队列 → [${queue.join(', ')}]`,
          codeLine: 5,
          objects: indegree.map((d, i) =>
            mkBar(`n${i}`, d * 5, i,
              d === 0 ? '#10b981' : result.includes(i) ? '#10b981' : '#3b82f6',
              `节点${i}(入度:${d})`)
          ),
        }
      }
    }
  }

  if (result.length < size) {
    yield {
      description: '图中存在环！拓扑排序无法完成（剩余节点入度均不为 0）',
      codeLine: 6,
      objects: indegree.map((v, i) =>
        mkBar(`n${i}`, v * 5, i, '#ef4444', `节点${i}`)
      ),
    }
  } else {
    yield {
      description: `拓扑排序完成！结果：[${result.join(' → ')}]`,
      codeLine: 7,
      objects: indegree.map((_, i) =>
        mkBar(`n${i}`, result.indexOf(i) + 1, i, '#10b981',
          `节点${i}(第${result.indexOf(i) + 1}个)`)
      ),
    }
  }
}
