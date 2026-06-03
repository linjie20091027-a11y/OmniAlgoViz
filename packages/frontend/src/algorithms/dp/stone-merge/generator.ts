import { COLORS, type Scene, type CellObject } from '@vsa/shared'

function mkCell(row: number, col: number, value: string | number, color: string): CellObject {
  return { kind: 'cell', id: `c-${row}-${col}`, row, col, value, color }
}

export default function* stoneMerge(params: { size: number }): Generator<Scene> {
  const n = params.size
  const stones: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 8) + 2)
  const prefix: number[] = new Array(n + 1).fill(0)
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + stones[i]

  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))

  yield {
    objects: (() => {
      const cells: CellObject[] = []
      cells.push(mkCell(0, 0, '石子', COLORS.default))
      for (let i = 0; i < n; i++) cells.push(mkCell(0, i + 1, stones[i], COLORS.default))
      cells.push(mkCell(1, 0, '前缀和', COLORS.default))
      for (let i = 0; i <= n; i++) cells.push(mkCell(1, i + 1, i === 0 ? 0 : prefix[i], COLORS.pivot))
      return cells
    })(),
    codeLine: 1,
    description: `${n} 堆石子：[${stones.join(', ')}]，求最小合并代价`,
  }

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1
      dp[i][j] = Infinity

      yield {
        objects: (() => {
          const cells: CellObject[] = []
          cells.push(mkCell(0, 0, '区间', COLORS.default))
          for (let c = 1; c <= n; c++) cells.push(mkCell(0, c, `第${c}堆`, COLORS.default))
          for (let ri = 0; ri < n; ri++) {
            cells.push(mkCell(ri + 1, 0, `第${ri + 1}堆`, COLORS.default))
            for (let cj = 0; cj < n; cj++) {
              if (cj >= ri) {
                if (ri === i && cj === j) {
                  cells.push(mkCell(ri + 1, cj + 1, '?', COLORS.comparing))
                } else if (cj < ri + len && ri >= i) {
                  cells.push(mkCell(ri + 1, cj + 1, dp[ri][cj] > 0 || ri === cj ? dp[ri][cj] : '', COLORS.pivot))
                } else {
                  cells.push(mkCell(ri + 1, cj + 1, dp[ri][cj] > 0 ? dp[ri][cj] : '', COLORS.default))
                }
              }
            }
          }
          return cells
        })(),
        codeLine: 3,
        description: `计算区间 [${i + 1}, ${j + 1}]（${len} 堆石子）`,
      }

      const sumCost = prefix[j + 1] - prefix[i]
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + sumCost

        yield {
          objects: (() => {
            const cells: CellObject[] = []
            cells.push(mkCell(0, 0, '尝试', COLORS.default))
            cells.push(mkCell(0, 1, `k=${k + 1}`, COLORS.highlight))
            cells.push(mkCell(0, 2, `cost=${cost}`, COLORS.highlight))
            cells.push(mkCell(0, 3, `左=${dp[i][k]}`, COLORS.pivot))
            cells.push(mkCell(0, 4, `右=${dp[k + 1][j]}`, COLORS.pivot))
            cells.push(mkCell(0, 5, `区间和=${sumCost}`, COLORS.default))
            return cells
          })(),
          codeLine: 4,
          description: `尝试在 k=${k + 1} 合并：dp[${i + 1}][${k + 1}]=${dp[i][k]} + dp[${k + 2}][${j + 1}]=${dp[k + 1][j]} + 合并代价${sumCost} = ${cost}`,
        }

        if (cost < dp[i][j]) dp[i][j] = cost
      }

      yield {
        objects: (() => {
          const cells: CellObject[] = []
          cells.push(mkCell(0, 0, '区间', COLORS.default))
          for (let c = 1; c <= n; c++) cells.push(mkCell(0, c, `第${c}堆`, COLORS.default))
          for (let ri = 0; ri < n; ri++) {
            cells.push(mkCell(ri + 1, 0, `第${ri + 1}堆`, COLORS.default))
            for (let cj = 0; cj < n; cj++) {
              if (cj >= ri) {
                if (ri === i && cj === j) {
                  cells.push(mkCell(ri + 1, cj + 1, dp[ri][cj], COLORS.sorted))
                } else if (dp[ri][cj] > 0 || ri === cj) {
                  cells.push(mkCell(ri + 1, cj + 1, ri === cj ? 0 : dp[ri][cj], COLORS.default))
                }
              }
            }
          }
          return cells
        })(),
        codeLine: 5,
        description: `区间 [${i + 1}, ${j + 1}] 最小代价 = ${dp[i][j]}`,
      }
    }
  }

  const finalCells: CellObject[] = []
  finalCells.push(mkCell(0, 0, '石子', COLORS.default))
  for (let i = 0; i < n; i++) finalCells.push(mkCell(0, i + 1, stones[i], COLORS.default))
  finalCells.push(mkCell(1, 0, 'DP表', COLORS.default))
  for (let ri = 0; ri < n; ri++) {
    for (let cj = 0; cj < n; cj++) {
      if (cj >= ri) {
        finalCells.push(mkCell(ri + 1, cj + 1, ri === cj ? 0 : dp[ri][cj], COLORS.sorted))
      }
    }
  }
  finalCells.push(mkCell(n + 2, 0, '结果', COLORS.highlight))
  finalCells.push(mkCell(n + 2, 1, `最小代价=${dp[0][n - 1]}`, COLORS.highlight))

  yield {
    objects: finalCells,
    codeLine: 6,
    description: `全部石子合并完成，最小总代价 = ${dp[0][n - 1]}`,
  }
}
