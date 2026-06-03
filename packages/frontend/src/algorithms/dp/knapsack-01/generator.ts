import { COLORS, type Scene, type CellObject } from '@vsa/shared'

function mkCell(row: number, col: number, value: string | number, color: string): CellObject {
  return { kind: 'cell', id: `c-${row}-${col}`, row, col, value, color }
}

export default function* knapsack01(params: { size: number }): Generator<Scene> {
  const n = params.size
  const weights: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 8) + 2)
  const values: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 15) + 3)
  const totalW = weights.reduce((a, b) => a + b, 0)
  const capacity = Math.floor(totalW * 0.55)

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0))

  yield {
    objects: [
      ...Array.from({ length: n + 1 }, (_, i) =>
        mkCell(i, 0, i === 0 ? '物品' : `w${weights[i - 1]}v${values[i - 1]}`, COLORS.default)
      ),
      ...Array.from({ length: capacity + 1 }, (_, w) =>
        mkCell(0, w, w === 0 ? '容量' : w, COLORS.default)
      ),
    ],
    codeLine: 1,
    description: `共 ${n} 件物品，背包容量 W=${capacity}，每件物品可选择放入或不放入`,
  }

  for (let i = 1; i <= n; i++) {
    const wgt = weights[i - 1]
    const val = values[i - 1]
    const cells: CellObject[] = []

    cells.push(mkCell(i, 0, `物品${i}`, COLORS.comparing))
    for (let w = 0; w <= capacity; w++) {
      const prev = dp[i - 1][w]
      const canTake = w >= wgt
      const takeVal = canTake ? dp[i - 1][w - wgt] + val : -1
      const best = Math.max(prev, takeVal)
      const color = canTake && best === takeVal && best > prev ? COLORS.highlight : COLORS.default
      cells.push(mkCell(i, w, best, color))
    }

    yield {
      objects: cells,
      codeLine: 5,
      description: `考虑物品 ${i}（重量=${wgt}，价值=${val}）：dp[${i}][w] = max(dp[${i - 1}][w], dp[${i - 1}][w - ${wgt}] + ${val})`,
    }

    for (let w = 0; w <= capacity; w++) {
      if (w < wgt) {
        dp[i][w] = dp[i - 1][w]
      } else {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - wgt] + val)
      }
    }

    const doneCells: CellObject[] = []
    doneCells.push(mkCell(i, 0, `物品${i}`, COLORS.sorted))
    for (let w = 0; w <= capacity; w++) {
      const v = dp[i][w]
      const prev = dp[i - 1][w]
      const color = v > prev ? COLORS.sorted : v === 0 ? COLORS.inactive : COLORS.default
      doneCells.push(mkCell(i, w, v, color))
    }
    yield {
      objects: doneCells,
      codeLine: 6,
      description: `第 ${i} 行完成：最大价值 = ${dp[i][capacity]}`,
    }
  }

  const selected: number[] = []
  let ci = n, cw = capacity
  while (ci > 0 && cw > 0) {
    if (dp[ci][cw] !== dp[ci - 1][cw]) {
      selected.push(ci - 1)
      cw -= weights[ci - 1]
    }
    ci--
  }

  const backCells: CellObject[] = []
  for (let i = 0; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      const isSelected = selected.some(s => {
        let tc = n, tw = capacity
        const path: [number, number][] = []
        while (tc > 0 && tw > 0) {
          if (dp[tc][tw] !== dp[tc - 1][tw]) {
            path.push([tc, tw])
            tw -= weights[tc - 1]
          }
          tc--
        }
        return path.some(([r, c]) => r === i && c === w)
      })
      backCells.push(mkCell(i, w, dp[i][w], isSelected ? COLORS.sorted : COLORS.inactive))
    }
  }
  yield {
    objects: backCells,
    codeLine: 10,
    description: `回溯完成：选中物品 ${selected.sort((a, b) => a - b).join(', ')}，最大价值 = ${dp[n][capacity]}`,
  }
}
