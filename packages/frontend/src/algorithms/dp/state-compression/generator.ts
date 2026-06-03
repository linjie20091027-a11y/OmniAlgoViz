import { COLORS, type Scene, type CellObject } from '@vsa/shared'

function mkCell(row: number, col: number, value: string | number, color: string): CellObject {
  return { kind: 'cell', id: `c-${row}-${col}`, row, col, value, color }
}

export default function* tspStateCompression(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 5)
  const dist: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => 0)
  )

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      dist[i][j] = dist[j][i] = Math.floor(Math.random() * 20) + 5
    }
  }

  yield {
    objects: (() => {
      const cells: CellObject[] = []
      cells.push(mkCell(0, 0, '城市', COLORS.default))
      for (let j = 0; j < n; j++) cells.push(mkCell(0, j + 1, j, COLORS.default))
      for (let i = 0; i < n; i++) {
        cells.push(mkCell(i + 1, 0, i, COLORS.default))
        for (let j = 0; j < n; j++) {
          cells.push(mkCell(i + 1, j + 1, i === j ? '-' : dist[i][j], COLORS.default))
        }
      }
      return cells
    })(),
    codeLine: 1,
    description: `${n} 个城市的距离矩阵，从城市 0 出发访问所有城市恰好一次后回到 0，求最短路径`,
  }

  const M = 1 << n
  const dp: number[][] = Array.from({ length: M }, () => new Array(n).fill(Infinity))
  dp[1][0] = 0

  let sceneCount = 0
  for (let mask = 1; mask < M; mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue
      if (dp[mask][u] === Infinity) continue

      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue
        const newMask = mask | (1 << v)
        const newDist = dp[mask][u] + dist[u][v]

        if (newDist < dp[newMask][v]) {
          dp[newMask][v] = newDist

          if (sceneCount < 25) {
            const cells: CellObject[] = []
            const maskStr = mask.toString(2).padStart(n, '0').split('').reverse().join('')
            const newMaskStr = newMask.toString(2).padStart(n, '0').split('').reverse().join('')

            cells.push(mkCell(0, 0, 'mask', COLORS.default))
            cells.push(mkCell(0, 1, maskStr, COLORS.pivot))
            cells.push(mkCell(0, 2, `→ ${newMaskStr}`, COLORS.highlight))
            cells.push(mkCell(1, 0, '当前城市', COLORS.default))
            cells.push(mkCell(1, 1, u, COLORS.comparing))
            cells.push(mkCell(1, 2, `→ ${v}`, COLORS.highlight))
            cells.push(mkCell(2, 0, '距离', COLORS.default))
            cells.push(mkCell(2, 1, `dp[${maskStr}][${u}]=${dp[mask][u]}`, COLORS.pivot))
            cells.push(mkCell(2, 2, `+${dist[u][v]}=${newDist}`, COLORS.highlight))
            cells.push(mkCell(3, 0, '更新', COLORS.default))
            cells.push(mkCell(3, 1, `dp[${newMaskStr}][${v}]=${newDist}`, COLORS.sorted))

            yield {
              objects: cells,
              codeLine: 5,
              description: `从 mask=${maskStr} 的 ${u} 转移到 ${v}，新 mask=${newMaskStr}，代价=${newDist}`,
            }
            sceneCount++
          }
        }
      }
    }
  }

  const fullMask = (1 << n) - 1
  let answer = Infinity
  let lastCity = 0

  for (let v = 1; v < n; v++) {
    const total = dp[fullMask][v] + dist[v][0]
    if (total < answer) {
      answer = total
      lastCity = v
    }
  }

  const finalCells: CellObject[] = []
  const maskStr = fullMask.toString(2).padStart(n, '0').split('').reverse().join('')
  finalCells.push(mkCell(0, 0, '全访问mask', COLORS.default))
  finalCells.push(mkCell(0, 1, maskStr, COLORS.highlight))
  finalCells.push(mkCell(1, 0, 'DP表大小', COLORS.default))
  finalCells.push(mkCell(1, 1, `${M}x${n} = ${M * n}`, COLORS.pivot))
  finalCells.push(mkCell(2, 0, '结果', COLORS.highlight))
  finalCells.push(mkCell(2, 1, `最短路径=${answer}`, COLORS.highlight))
  finalCells.push(mkCell(3, 0, '状态数', COLORS.default))
  finalCells.push(mkCell(3, 1, `2^${n}=${M}`, COLORS.pivot))

  yield {
    objects: finalCells,
    codeLine: 7,
    description: `状压DP完成：访问所有 ${n} 个城市的最短路径长度 = ${answer}`,
  }
}
