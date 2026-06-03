import { COLORS, type Scene, type CellObject } from '@vsa/shared'

function mkCell(row: number, col: number, value: string | number, color: string): CellObject {
  return { kind: 'cell', id: `c-${row}-${col}`, row, col, value, color }
}

export default function* digitDp(params: { size: number }): Generator<Scene> {
  const digits = params.size
  const maxNum = Math.pow(10, digits) - 1
  const R = Math.floor(Math.random() * maxNum) + 100
  const targetSum = Math.floor(Math.random() * 9 * digits) + 1
  const RDigits = String(R).padStart(digits, '0').split('').map(Number)

  yield {
    objects: (() => {
      const cells: CellObject[] = []
      cells.push(mkCell(0, 0, `上限R=${R}`, COLORS.default))
      cells.push(mkCell(0, 1, `目标和=${targetSum}`, COLORS.default))
      cells.push(mkCell(1, 0, '数位', COLORS.default))
      for (let i = 0; i < digits; i++) cells.push(mkCell(1, i + 1, `d${digits - i - 1}`, COLORS.default))
      cells.push(mkCell(2, 0, 'R的各位', COLORS.default))
      for (let i = 0; i < digits; i++) cells.push(mkCell(2, i + 1, RDigits[i], COLORS.highlight))
      return cells
    })(),
    codeLine: 1,
    description: `数位DP：统计 [0, ${R}] 中各位数字之和 = ${targetSum} 的数有多少个`,
  }

  const memo: Map<string, number> = new Map()

  function dfs(pos: number, sum: number, tight: boolean): [number, CellObject[]] {
    if (sum > targetSum) return [0, []]
    if (pos === digits) return [sum === targetSum ? 1 : 0, []]

    const key = `${pos},${sum},${tight}`
    if (memo.has(key)) return [memo.get(key)!, []]

    const limit = tight ? RDigits[pos] : 9
    let total = 0
    const cells: CellObject[] = []

    for (let d = 0; d <= limit; d++) {
      const [sub, subCells] = dfs(pos + 1, sum + d, tight && d === limit)
      total += sub
      cells.push(...subCells)
      cells.push(mkCell(3 + pos, 0, `位${digits - pos}`, COLORS.default))
      for (let i = 0; i < digits; i++) {
        cells.push(mkCell(3 + pos, i + 1, i === pos ? d : (i < pos ? RDigits[i] : '?'), i === pos ? COLORS.comparing : COLORS.default))
      }
    }

    memo.set(key, total)
    return [total, cells]
  }

  let rowOffset = 3
  function stepDfs(pos: number, sum: number, tight: boolean): number {
    if (sum > targetSum) return 0
    if (pos === digits) return sum === targetSum ? 1 : 0

    const key = `${pos},${sum},${tight}`
    if (memo.has(key)) return memo.get(key)!

    const limit = tight ? RDigits[pos] : 9
    let total = 0

    for (let d = 0; d <= limit; d++) {
      total += stepDfs(pos + 1, sum + d, tight && d === limit)
    }

    memo.set(key, total)
    return total
  }

  const answer = stepDfs(0, 0, true)

  const finalCells: CellObject[] = []
  finalCells.push(mkCell(0, 0, `R=${R}`, COLORS.default))
  finalCells.push(mkCell(0, 1, `目标和=${targetSum}`, COLORS.default))
  finalCells.push(mkCell(1, 0, '数位', COLORS.default))
  for (let i = 0; i < digits; i++) finalCells.push(mkCell(1, i + 1, `d${digits - i - 1}`, COLORS.default))
  finalCells.push(mkCell(2, 0, '状态', COLORS.default))
  finalCells.push(mkCell(2, 1, `状态数=${memo.size}`, COLORS.pivot))
  finalCells.push(mkCell(3, 0, '结果', COLORS.highlight))
  finalCells.push(mkCell(3, 1, `共有 ${answer} 个数`, COLORS.highlight))

  const cols = digits + 1
  for (let pos = 0; pos < digits; pos++) {
    for (let s = 0; s <= targetSum; s++) {
      for (let tight = 0; tight <= 1; tight++) {
        const key = `${pos},${s},${tight === 1}`
        if (memo.has(key)) {
          const r = 4 + pos + tight
          finalCells.push(mkCell(r, 0, `pos=${pos}`, COLORS.default))
          finalCells.push(mkCell(r, 1, `sum=${s}`, COLORS.default))
          finalCells.push(mkCell(r, 2, `tight=${tight}`, COLORS.default))
          finalCells.push(mkCell(r, 3, `count=${memo.get(key)}`, COLORS.sorted))
        }
      }
    }
  }

  yield {
    objects: finalCells,
    codeLine: 5,
    description: `数位DP完成：在 [0, ${R}] 中，各位数字之和 = ${targetSum} 的数共有 ${answer} 个`,
  }
}
