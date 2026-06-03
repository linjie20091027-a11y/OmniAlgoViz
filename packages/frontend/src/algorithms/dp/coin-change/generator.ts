import { COLORS, type Scene, type CellObject } from '@vsa/shared'

function mkCell(row: number, col: number, value: string | number, color: string): CellObject {
  return { kind: 'cell', id: `c-${row}-${col}`, row, col, value, color }
}

export default function* coinChange(params: { size: number }): Generator<Scene> {
  const amount = params.size
  const coinPool = [1, 2, 5, 10, 25]
  const coins = coinPool.filter(c => c <= amount).slice(0, 4)
  if (coins.length === 0) coins.push(1)

  const dp: number[] = new Array(amount + 1).fill(Infinity)
  dp[0] = 0

  const row0: CellObject[] = []
  row0.push(mkCell(0, 0, '金额', COLORS.default))
  for (let a = 0; a <= amount; a++) row0.push(mkCell(0, a + 1, a, COLORS.default))
  row0.push(mkCell(1, 0, '初始', COLORS.default))
  for (let a = 0; a <= amount; a++) row0.push(mkCell(1, a + 1, a === 0 ? 0 : '∞', COLORS.default))

  yield {
    objects: row0,
    codeLine: 1,
    description: `目标金额=${amount}，硬币面额：[${coins.join(', ')}]，求最小硬币数`,
  }

  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i]
    const row: CellObject[] = []

    row.push(mkCell(0, 0, '金额', COLORS.default))
    for (let a = 0; a <= amount; a++) row.push(mkCell(0, a + 1, a, COLORS.default))
    row.push(mkCell(i + 2, 0, `硬币${coin}`, COLORS.comparing))

    for (let a = 0; a <= amount; a++) {
      row.push(mkCell(i + 2, a + 1, dp[a] === Infinity ? '∞' : dp[a], COLORS.default))
    }

    yield {
      objects: row,
      codeLine: 4,
      description: `开始处理硬币面额 ${coin}`,
    }

    for (let a = coin; a <= amount; a++) {
      if (dp[a - coin] !== Infinity) {
        const oldVal = dp[a]
        dp[a] = Math.min(dp[a], dp[a - coin] + 1)

        if (dp[a] !== oldVal) {
          const updRow: CellObject[] = []
          updRow.push(mkCell(0, 0, '金额', COLORS.default))
          for (let k = 0; k <= amount; k++) updRow.push(mkCell(0, k + 1, k, COLORS.default))
          updRow.push(mkCell(i + 2, 0, `硬币${coin}`, COLORS.comparing))
          for (let k = 0; k <= amount; k++) {
            const color = k === a ? COLORS.highlight : k === a - coin ? COLORS.pivot : COLORS.default
            updRow.push(mkCell(i + 2, k + 1, dp[k] === Infinity ? '∞' : dp[k], color))
          }

          yield {
            objects: updRow,
            codeLine: 5,
            description: `使用硬币 ${coin}，金额 ${a} 最小硬币数 = ${dp[a]}（由 ${a - coin} + 1 更新）`,
          }
        }
      }
    }

    const doneRow: CellObject[] = []
    doneRow.push(mkCell(0, 0, '金额', COLORS.default))
    for (let k = 0; k <= amount; k++) doneRow.push(mkCell(0, k + 1, k, COLORS.default))
    doneRow.push(mkCell(i + 2, 0, `硬币${coin}`, COLORS.sorted))
    for (let k = 0; k <= amount; k++) {
      doneRow.push(mkCell(i + 2, k + 1, dp[k] === Infinity ? '∞' : dp[k], COLORS.sorted))
    }

    yield {
      objects: doneRow,
      codeLine: 6,
      description: `硬币 ${coin} 处理完成`,
    }
  }

  const result = dp[amount] === Infinity ? '无解' : dp[amount].toString()
  yield {
    objects: (() => {
      const cells: CellObject[] = []
      cells.push(mkCell(0, 0, '金额', COLORS.default))
      for (let a = 0; a <= amount; a++) cells.push(mkCell(0, a + 1, a, COLORS.default))
      cells.push(mkCell(1, 0, '结果', COLORS.highlight))
      for (let a = 0; a <= amount; a++) {
        cells.push(mkCell(1, a + 1, dp[a] === Infinity ? '∞' : dp[a], a === amount ? COLORS.highlight : COLORS.sorted))
      }
      return cells
    })(),
    codeLine: 8,
    description: `最终结果：目标 ${amount} 最少需要 ${result} 枚硬币`,
  }
}
