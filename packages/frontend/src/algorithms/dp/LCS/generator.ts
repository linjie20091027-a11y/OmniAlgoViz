import { COLORS, type Scene, type CellObject } from '@vsa/shared'

function mkCell(row: number, col: number, value: string | number, color: string): CellObject {
  return { kind: 'cell', id: `c-${row}-${col}`, row, col, value, color }
}

export default function* lcsGen(params: { size: number }): Generator<Scene> {
  const len = params.size
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const a = Array.from({ length: len }, () => chars[Math.floor(Math.random() * 26)]).join('')
  const b = Array.from({ length: len }, () => chars[Math.floor(Math.random() * 26)]).join('')

  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  const dir: string[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(''))

  yield {
    objects: [
      ...Array.from({ length: m + 1 }, (_, i) =>
        mkCell(i, 0, i === 0 ? ' ' : a[i - 1], COLORS.default)
      ),
      ...Array.from({ length: n + 1 }, (_, j) =>
        mkCell(0, j, j === 0 ? ' ' : b[j - 1], COLORS.default)
      ),
    ],
    codeLine: 1,
    description: `字符串 A="${a}"，字符串 B="${b}"，求最长公共子序列`,
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cells: CellObject[] = []

      cells.push(mkCell(i, 0, a[i - 1], COLORS.comparing))
      cells.push(mkCell(0, j, b[j - 1], COLORS.comparing))

      for (let ri = 1; ri <= m; ri++) {
        for (let cj = 1; cj <= n; cj++) {
          if (ri < i || (ri === i && cj < j)) {
            cells.push(mkCell(ri, cj, dp[ri][cj], COLORS.sorted))
          } else if (ri === i && cj === j) {
            cells.push(mkCell(ri, cj, '?', COLORS.comparing))
          }
        }
      }

      yield {
        objects: cells,
        codeLine: 4,
        description: `比较 A[${i}]="${a[i - 1]}" 和 B[${j}]="${b[j - 1]}"`,
      }

      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
        dir[i][j] = '↖'
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        dp[i][j] = dp[i - 1][j]
        dir[i][j] = '↑'
      } else {
        dp[i][j] = dp[i][j - 1]
        dir[i][j] = '←'
      }

      const updateCells: CellObject[] = []
      for (let ri = 0; ri <= m; ri++) {
        for (let cj = 0; cj <= n; cj++) {
          if (ri === i && cj === j) {
            updateCells.push(mkCell(ri, cj, `${dp[ri][cj]}${dir[ri][cj]}`, COLORS.highlight))
          } else if ((ri === 0 || cj === 0) && !(ri === 0 && cj === 0)) {
            updateCells.push(mkCell(ri, cj, ri === 0 ? (cj === 0 ? ' ' : b[cj - 1]) : a[ri - 1], COLORS.default))
          } else if (ri <= i && cj <= n) {
            updateCells.push(mkCell(ri, cj, dp[ri][cj] > 0 ? `${dp[ri][cj]}${dir[ri][cj]}` : '', dp[ri][cj] > 0 ? COLORS.sorted : COLORS.default))
          }
        }
      }
      yield {
        objects: updateCells,
        codeLine: 5,
        description: `dp[${i}][${j}] = ${dp[i][j]} ${dir[i][j]}`,
      }
    }
  }

  const lcs: string[] = []
  let i = m, j = n
  const pathCells = new Set<string>()
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      lcs.unshift(a[i - 1])
      pathCells.add(`${i}-${j}`)
      i--
      j--
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  const finalCells: CellObject[] = []
  for (let ri = 1; ri <= m; ri++) {
    for (let cj = 1; cj <= n; cj++) {
      const color = pathCells.has(`${ri}-${cj}`) ? COLORS.sorted : COLORS.default
      finalCells.push(mkCell(ri, cj, dp[ri][cj] > 0 ? `${dp[ri][cj]}${dir[ri][cj]}` : '', color))
    }
  }
  yield {
    objects: finalCells,
    codeLine: 8,
    description: `最长公共子序列："${lcs.join('')}"，长度 = ${lcs.length}`,
  }
}
