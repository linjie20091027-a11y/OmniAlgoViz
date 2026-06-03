import { COLORS, type Scene, type CellObject } from '@vsa/shared'

function mkCell(row: number, col: number, value: string | number, color: string): CellObject {
  return { kind: 'cell', id: `c-${row}-${col}`, row, col, value, color }
}

export default function* matrixChain(params: { size: number }): Generator<Scene> {
  const n = params.size
  const dims: number[] = [Math.floor(Math.random() * 20) + 5]
  for (let i = 0; i < n; i++) dims.push(Math.floor(Math.random() * 20) + 5)

  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
  const split: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1))

  yield {
    objects: [
      ...Array.from({ length: n + 1 }, (_, i) =>
        mkCell(i, 0, i === 0 ? '矩阵' : `A${i}`, COLORS.default)
      ),
      ...Array.from({ length: n }, (_, j) =>
        mkCell(0, j + 1, `A${j + 1}`, COLORS.default)
      ),
      ...Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) =>
          mkCell(i + 1, j + 1, i === j ? `A${i + 1}(${dims[i]}x${dims[i + 1]})` : '', COLORS.default)
        )
      ).flat(),
    ],
    codeLine: 1,
    description: `${n} 个矩阵，维度：[${dims.join(', ')}]，求最优括号方案`,
  }

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1
      dp[i][j] = Infinity

      const scanCells: CellObject[] = []
      for (let ri = 0; ri <= n; ri++) {
        for (let cj = 0; cj <= n; cj++) {
          if (ri === 0 && cj > 0) scanCells.push(mkCell(ri, cj, `A${cj}`, COLORS.default))
          else if (cj === 0 && ri > 0) scanCells.push(mkCell(ri, cj, `A${ri}`, COLORS.default))
          else if (ri > 0 && cj > 0) {
            if (ri === i + 1 && cj === j + 1) {
              scanCells.push(mkCell(ri, cj, '?', COLORS.comparing))
            } else {
              scanCells.push(mkCell(ri, cj, dp[ri - 1][cj - 1] > 0 ? dp[ri - 1][cj - 1] : '', COLORS.default))
            }
          }
        }
      }
      yield {
        objects: scanCells,
        codeLine: 3,
        description: `计算区间 A${i + 1}...A${j + 1}（长度=${len}）`,
      }

      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]

        const tryCells: CellObject[] = []
        for (let ri = 0; ri <= n; ri++) {
          for (let cj = 0; cj <= n; cj++) {
            if (ri === 0 && cj > 0) tryCells.push(mkCell(ri, cj, `A${cj}`, COLORS.default))
            else if (cj === 0 && ri > 0) tryCells.push(mkCell(ri, cj, `A${ri}`, COLORS.default))
            else if (ri > 0 && cj > 0) {
              const riActual = ri - 1, cjActual = cj - 1
              if (riActual === i && cjActual === k) {
                tryCells.push(mkCell(ri, cj, dp[riActual][cjActual], COLORS.pivot))
              } else if (riActual === k + 1 && cjActual === j) {
                tryCells.push(mkCell(ri, cj, dp[riActual][cjActual], COLORS.highlight))
              } else if (riActual === i && cjActual === j) {
                tryCells.push(mkCell(ri, cj, cost < dp[i][j] ? cost : dp[i][j], COLORS.comparing))
              } else {
                tryCells.push(mkCell(ri, cj, dp[riActual][cjActual] > 0 ? dp[riActual][cjActual] : '', COLORS.default))
              }
            }
          }
        }
        yield {
          objects: tryCells,
          codeLine: 4,
          description: `尝试分割点 k=${k + 1}：(A${i + 1}...A${k + 1})(A${k + 2}...A${j + 1})，乘法次数=${cost}`,
        }

        if (cost < dp[i][j]) {
          dp[i][j] = cost
          split[i][j] = k
        }
      }

      const doneCells: CellObject[] = []
      for (let ri = 0; ri <= n; ri++) {
        for (let cj = 0; cj <= n; cj++) {
          if (ri === 0 && cj > 0) doneCells.push(mkCell(ri, cj, `A${cj}`, COLORS.default))
          else if (cj === 0 && ri > 0) doneCells.push(mkCell(ri, cj, `A${ri}`, COLORS.default))
          else if (ri > 0 && cj > 0) {
            if (ri === i + 1 && cj === j + 1) {
              doneCells.push(mkCell(ri, cj, dp[i][j], COLORS.sorted))
            } else {
              doneCells.push(mkCell(ri, cj, dp[ri - 1][cj - 1] > 0 ? dp[ri - 1][cj - 1] : '', COLORS.default))
            }
          }
        }
      }
      yield {
        objects: doneCells,
        codeLine: 5,
        description: `A${i + 1}...A${j + 1} 最优乘法次数 = ${dp[i][j]}，分割点在 k=${split[i][j] + 1}`,
      }
    }
  }

  function buildParen(i: number, j: number): string {
    if (i === j) return `A${i + 1}`
    const k = split[i][j]
    return `(${buildParen(i, k)} × ${buildParen(k + 1, j)})`
  }

  const finalCells: CellObject[] = []
  for (let ri = 0; ri <= n; ri++) {
    for (let cj = 0; cj <= n; cj++) {
      if (ri === 0 && cj > 0) finalCells.push(mkCell(ri, cj, `A${cj}`, COLORS.default))
      else if (cj === 0 && ri > 0) finalCells.push(mkCell(ri, cj, `A${ri}`, COLORS.default))
      else if (ri > 0 && cj > 0) {
        finalCells.push(mkCell(ri, cj, dp[ri - 1][cj - 1] > 0 ? dp[ri - 1][cj - 1] : '', COLORS.sorted))
      }
    }
  }
  finalCells.push(mkCell(n + 1, 0, '括号', COLORS.highlight))
  finalCells.push(mkCell(n + 1, 1, buildParen(0, n - 1), COLORS.highlight))

  yield {
    objects: finalCells,
    codeLine: 7,
    description: `最优括号方案：${buildParen(0, n - 1)}，最少乘法次数 = ${dp[0][n - 1]}`,
  }
}
