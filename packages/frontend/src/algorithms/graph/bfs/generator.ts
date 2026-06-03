import { Scene, BarObject, COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generate(): Generator<Scene> {
  const size = 6
  const INF = 999

  // 图邻接表: 0-1, 0-2, 1-3, 1-4, 2-4, 3-5, 4-5
  const graph: number[][] = [
    [1, 2],
    [0, 3, 4],
    [0, 4],
    [1, 5],
    [1, 2, 5],
    [3, 4],
  ]

  let dist: number[] = Array(size).fill(INF)
  let visited: boolean[] = Array(size).fill(false)
  let queue: number[] = []
  let current: number = -1

  yield {
    description: '初始化：将所有节点的距离设为无穷大（INF），visited 数组全部置为 false',
    codeLine: 1,
    objects: dist.map((v, i) => mkBar(`n${i}`, v === INF ? 0 : v, i, '#6b7280', `节点${i}`)),
  }

  dist[0] = 0
  visited[0] = true
  queue.push(0)

  yield {
    description: '将源节点 0 的距离设为 0，标记为已访问，加入队列：[0]',
    codeLine: 2,
    objects: dist.map((v, i) =>
      mkBar(`n${i}`, v === INF ? 0 : v, i,
        i === 0 ? '#ef4444' : '#6b7280', `节点${i}`)
    ),
  }

  yield {
    description: '队列非空，开始处理。当前队列：[0]',
    codeLine: 3,
    objects: dist.map((v, i) =>
      mkBar(`n${i}`, v === INF ? 0 : v, i,
        i === 0 ? '#3b82f6' : '#6b7280', `节点${i}`)
    ),
  }

  current = queue.shift()!

  yield {
    description: '从队列头部取出节点 0，当前处理节点 0（距离 = 0）',
    codeLine: 4,
    objects: dist.map((v, i) =>
      mkBar(`n${i}`, v === INF ? 0 : v, i,
        i === 0 ? '#ef4444' : '#6b7280', `节点${i}`)
    ),
  }

  // Process neighbors of 0: 1, 2
  for (let ni = 0; ni < graph[0].length; ni++) {
    const v = graph[0][ni]
    if (!visited[v]) {
      dist[v] = dist[0] + 1
      visited[v] = true
      queue.push(v)

      yield {
        description: `遍历节点 0 的邻居节点 ${v}，dist[${v}] 更新为 ${dist[v]}，标记已访问，加入队列 → [${queue.join(', ')}]`,
        codeLine: 5,
        objects: dist.map((d, i) =>
          mkBar(`n${i}`, d === INF ? 0 : d, i,
            i === v ? '#10b981' : visited[i] ? '#3b82f6' : '#6b7280',
            i === 0 ? `节点0(✓)` : `节点${i}`)
        ),
      }
    }
  }

  // Process node 1
  yield {
    description: '队列仍有元素，继续处理。当前队列：[' + queue.join(', ') + ']',
    codeLine: 3,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 0 : d, i,
        visited[i] ? '#3b82f6' : '#6b7280', `节点${i}`)
    ),
  }

  current = queue.shift()!

  yield {
    description: `从队列取出节点 ${current}（距离 = ${dist[current]}），开始处理其邻居`,
    codeLine: 4,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d === INF ? 0 : d, i,
        i === current ? '#ef4444' : visited[i] ? '#10b981' : '#6b7280',
        `节点${i}`)
    ),
  }

  for (let ni = 0; ni < graph[current].length; ni++) {
    const v = graph[current][ni]
    if (!visited[v]) {
      dist[v] = dist[current] + 1
      visited[v] = true
      queue.push(v)

      yield {
        description: `访问节点 ${current} 的邻居节点 ${v}，dist[${v}] 更新为 ${dist[v]}，加入队列 → [${queue.join(', ')}]`,
        codeLine: 5,
        objects: dist.map((d, i) =>
          mkBar(`n${i}`, d === INF ? 0 : d, i,
            i === v ? '#10b981' : visited[i] ? '#3b82f6' : '#6b7280',
            i === current ? `节点${current}(当前)` : `节点${i}`)
        ),
      }
    } else {
      yield {
        description: `节点 ${v} 已经被访问过（距离 = ${dist[v]}），跳过`,
        codeLine: 6,
        objects: dist.map((d, i) =>
          mkBar(`n${i}`, d === INF ? 0 : d, i,
            visited[i] ? '#10b981' : '#6b7280', `节点${i}`)
        ),
      }
    }
  }

  // Process remaining nodes in queue until empty
  while (queue.length > 0) {
    current = queue.shift()!

    yield {
      description: `从队列取出节点 ${current}（距离 = ${dist[current]}），检查邻居`,
      codeLine: 4,
      objects: dist.map((d, i) =>
        mkBar(`n${i}`, d === INF ? 0 : d, i,
          i === current ? '#ef4444' : '#10b981', `节点${i}`)
      ),
    }

    for (const v of graph[current]) {
      if (!visited[v]) {
        dist[v] = dist[current] + 1
        visited[v] = true
        queue.push(v)

        yield {
          description: `发现未访问节点 ${v}，dist[${v}] = ${dist[v]}，加入队列 → [${queue.join(', ')}]`,
          codeLine: 5,
          objects: dist.map((d, i) =>
            mkBar(`n${i}`, d === INF ? 0 : d, i,
              i === v ? '#10b981' : '#3b82f6', `节点${i}`)
          ),
        }
      } else {
        yield {
          description: `节点 ${v} 已访问（距离 = ${dist[v]}），跳过`,
          codeLine: 6,
          objects: dist.map((d, i) =>
            mkBar(`n${i}`, d === INF ? 0 : d, i,
              '#10b981', `节点${i}`)
          ),
        }
      }
    }
  }

  yield {
    description: '队列为空，BFS 完成！所有节点的最短距离已求出',
    codeLine: 7,
    objects: dist.map((d, i) =>
      mkBar(`n${i}`, d, i, '#10b981', `节点${i}`)
    ),
  }
}
