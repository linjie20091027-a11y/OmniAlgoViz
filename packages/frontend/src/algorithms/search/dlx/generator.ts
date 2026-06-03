import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* dlx(params: { size: number }): Generator<Scene> {
  const MAX = params.size
  // 简单精确覆盖问题: 用列表示需求(A,B,C,D...)，行表示选择

  const cols = Math.min(4, Math.floor(MAX / 2))
  const colNames = Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i))
  // 生成覆盖矩阵
  const matrix: number[][] = Array.from({ length: MAX }, () =>
    Array.from({ length: cols }, () => Math.random() < 0.4 ? 1 : 0)
  )
  // 确保每列至少有一个1
  for (let c = 0; c < cols; c++) {
    if (!matrix.some(row => row[c] === 1)) {
      matrix[Math.floor(Math.random() * MAX)][c] = 1
    }
  }

  yield {
    objects: matrix.flatMap((row, ri) =>
      row.map((v, ci) => mkBar(`m-${ri}-${ci}`, v === 1 ? 3 : 0, ci, v === 1 ? COLORS.default : COLORS.inactive, `${rowName(ri)}${v ? '●' : '○'}`))
    ),
    highlights: [],
    codeLine: 1,
    description: `精确覆盖矩阵 ${MAX}行×${cols}列，找覆盖所有列的最小行集`,
  }

  // 列状搜索（贪心启发式）
  const uncovered = new Set<number>()
  for (let c = 0; c < cols; c++) uncovered.add(c)

  const solution: number[] = []
  const deadRows = new Set<number>()

  while (uncovered.size > 0) {
    yield {
      objects: matrix.flatMap((row, ri) =>
        row.map((v, ci) => {
          let color = COLORS.inactive
          if (v === 1 && !deadRows.has(ri)) color = COLORS.default
          if (deadRows.has(ri)) color = COLORS.inactive
          if (solution.includes(ri)) color = COLORS.sorted
          if (uncovered.has(ci) && solution.includes(ri)) color = COLORS.highlight
          return mkBar(`m-${ri}-${ci}`, v === 1 ? 3 : 0, ci, color, `${rowName(ri)}${v ? '●' : '○'}`)
        })
      ),
      highlights: [],
      codeLine: 5,
      description: `未覆盖列: ${[...uncovered].map(c => colNames[c]).join(', ')}，已选行: ${solution.length}`,
    }

    // 覆盖最少行能覆盖的列
    let bestRow = -1, maxCover = -1
    for (let r = 0; r < MAX; r++) {
      if (deadRows.has(r) || solution.includes(r)) continue
      let cover = 0
      for (const c of uncovered) {
        if (matrix[r][c] === 1) cover++
      }
      if (cover > maxCover) { maxCover = cover; bestRow = r }
    }

    if (bestRow === -1) break

    solution.push(bestRow)
    for (let c = 0; c < cols; c++) {
      if (matrix[bestRow][c] === 1) uncovered.delete(c)
    }

    // 移除冲突行
    for (let r = 0; r < MAX; r++) {
      if (r === bestRow) continue
      let conflict = false
      for (let c = 0; c < cols; c++) {
        if (matrix[bestRow][c] === 1 && matrix[r][c] === 1) { conflict = true; break }
      }
      if (conflict && !solution.includes(r)) deadRows.add(r)
    }

    yield {
      objects: matrix.flatMap((row, ri) =>
        row.map((v, ci) => {
          let color = COLORS.inactive
          if (solution.includes(ri)) color = COLORS.sorted
          else if (deadRows.has(ri)) color = COLORS.inactive
          else if (v === 1) color = COLORS.default
          return mkBar(`m-${ri}-${ci}`, v === 1 ? 3 : 0, ci, color, `${rowName(ri)}${v ? '●' : '○'}`)
        })
      ),
      highlights: solution.map(r => `m-${r}-0`),
      codeLine: 12,
      description: `选择行 ${rowName(bestRow)}，剩余未覆盖列: ${[...uncovered].map(c => colNames[c]).join(', ')}`,
    }
  }

  const finalBars = matrix.flatMap((row, ri) =>
    row.map((v, ci) => {
      let color = COLORS.inactive
      if (solution.includes(ri)) color = COLORS.sorted
      return mkBar(`m-${ri}-${ci}`, v === 1 ? 3 : 0, ci, color, `${rowName(ri)}${v ? '●' : '○'}`)
    })
  )
  yield {
    objects: finalBars,
    highlights: solution.map(r => `m-${r}-0`),
    codeLine: 18,
    description: uncovered.size === 0
      ? `覆盖成功！解: ${solution.map(rowName).join(', ')}`
      : `部分覆盖，剩余: ${[...uncovered].map(c => colNames[c]).join(', ')}`,
  }
}

function rowName(idx: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (idx < 26) return chars[idx]
  return `R${idx}`
}
