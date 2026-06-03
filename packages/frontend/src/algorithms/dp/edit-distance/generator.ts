import { COLORS, type Scene, type CellObject } from '@vsa/shared'

function mkCell(row: number, col: number, value: string | number, color: string): CellObject {
  return { kind: 'cell', id: `c-${row}-${col}`, row, col, value, color }
}

export default function* editDistance(params: { size: number }): Generator<Scene> {
  const len = params.size
  const words = ['kitten', 'sitting', 'horse', 'ros', 'intention', 'execution', 'algorithm', 'altruistic', 'sunday', 'saturday']
  const a = words[len % words.length]
  const b = words[(len + 3) % words.length]

  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  const op: string[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(''))

  for (let i = 0; i <= m; i++) { dp[i][0] = i; op[i][0] = '删除' }
  for (let j = 0; j <= n; j++) { dp[0][j] = j; op[0][j] = '插入' }
  op[0][0] = '起点'

  yield {
    objects: [
      ...Array.from({ length: m + 1 }, (_, i) =>
        mkCell(i, 0, i === 0 ? ' ' : a[i - 1], COLORS.default)
      ),
      ...Array.from({ length: n + 1 }, (_, j) =>
        mkCell(0, j, j === 0 ? ' ' : b[j - 1], COLORS.default)
      ),
      ...Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => {
          if (i === 0 || j === 0) return mkCell(i, j, dp[i][j], COLORS.default)
          return null
        })
      ).flat().filter(Boolean) as CellObject[],
    ],
    codeLine: 1,
    description: `字符串 A="${a}"（${m}字符），字符串 B="${b}"（${n}字符），计算编辑距离`,
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cells: CellObject[] = []
      cells.push(mkCell(i, 0, a[i - 1], COLORS.comparing))
      cells.push(mkCell(0, j, b[j - 1], COLORS.comparing))

      for (let ri = 1; ri <= m; ri++) {
        for (let cj = 1; cj <= n; cj++) {
          if (ri < i || (ri === i && cj < j)) {
            cells.push(mkCell(ri, cj, `${dp[ri][cj]}`, COLORS.sorted))
          }
        }
      }

      yield {
        objects: cells,
        codeLine: 4,
        description: `比较 A[${i}]="${a[i - 1]}" 和 B[${j}]="${b[j - 1]}"`,
      }

      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const del = dp[i - 1][j] + 1
      const ins = dp[i][j - 1] + 1
      const rep = dp[i - 1][j - 1] + cost

      if (del <= ins && del <= rep) {
        dp[i][j] = del
        op[i][j] = cost === 0 ? '匹配' : '删除'
      } else if (ins <= del && ins <= rep) {
        dp[i][j] = ins
        op[i][j] = '插入'
      } else {
        dp[i][j] = rep
        op[i][j] = cost === 0 ? '匹配' : '替换'
      }

      const updCells: CellObject[] = []
      for (let ri = 0; ri <= m; ri++) {
        for (let cj = 0; cj <= n; cj++) {
          if (ri === i && cj === j) {
            updCells.push(mkCell(ri, cj, `${dp[ri][cj]}`, COLORS.highlight))
          } else if ((ri === 0 || cj === 0) && !(ri === 0 && cj === 0)) {
            updCells.push(mkCell(ri, cj, ri === 0 ? (cj === 0 ? ' ' : b[cj - 1]) : a[ri - 1], COLORS.default))
          } else if (ri <= i && cj <= n && (ri > 0 && cj > 0)) {
            updCells.push(mkCell(ri, cj, `${dp[ri][cj]}`, COLORS.sorted))
          } else if (ri > 0 && cj === 0) {
            updCells.push(mkCell(ri, cj, dp[ri][0], COLORS.default))
          } else if (ri === 0 && cj > 0) {
            updCells.push(mkCell(ri, cj, dp[0][cj], COLORS.default))
          }
        }
      }
      yield {
        objects: updCells,
        codeLine: 5,
        description: `dp[${i}][${j}] = ${dp[i][j]}，操作：${op[i][j]}`,
      }
    }
  }

  const finalCells: CellObject[] = []
  finalCells.push(mkCell(0, 0, ' ', COLORS.default))
  for (let j = 1; j <= n; j++) finalCells.push(mkCell(0, j, b[j - 1], COLORS.default))
  for (let i = 1; i <= m; i++) {
    finalCells.push(mkCell(i, 0, a[i - 1], COLORS.default))
    for (let j = 1; j <= n; j++) {
      finalCells.push(mkCell(i, j, `${dp[i][j]}${op[i][j]}`, COLORS.sorted))
    }
  }
  finalCells.push(mkCell(m + 1, 0, '结果', COLORS.highlight))
  finalCells.push(mkCell(m + 1, 1, `编辑距离=${dp[m][n]}`, COLORS.highlight))

  yield {
    objects: finalCells,
    codeLine: 8,
    description: `"${a}" → "${b}"，编辑距离 = ${dp[m][n]}`,
  }
}
