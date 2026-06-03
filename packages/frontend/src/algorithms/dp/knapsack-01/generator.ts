import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* knapsack01(params: { size: number }): Generator<Scene> {
  const n = params.size
  const weights: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 8) + 2)
  const values: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 15) + 3)
  const totalW = weights.reduce((a, b) => a + b, 0)
  const capacity = Math.floor(totalW * 0.55)

  // 展示物品
  const items: BarObject[] = weights.map((w, i) =>
    mkBar(`item-${i}`, values[i], i, COLORS.default, `w${w} v${values[i]}`)
  )
  yield {
    objects: items,
    highlights: [],
    codeLine: 1,
    description: `共 ${n} 件物品，背包容量 W=${capacity}，每件物品可选择放入或不放入`,
  }

  // DP 表
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0))

  // 初始行：背包容量从 0 到 W 全部为 0
  const initRow: BarObject[] = []
  for (let w = 0; w <= capacity; w++) {
    initRow.push(mkBar(`dp-0-${w}`, 0, w, COLORS.inactive, `容量${w}`))
  }
  yield {
    objects: initRow,
    highlights: [],
    codeLine: 2,
    description: `DP 表初始化：第 0 行（没有物品）全部为 0`,
  }

  for (let i = 1; i <= n; i++) {
    const wgt = weights[i - 1]
    const val = values[i - 1]

    yield {
      objects: initRow.map((_, w) => {
        const prev = dp[i - 1][w]
        const canTake = w >= wgt
        const takeVal = canTake ? dp[i - 1][w - wgt] + val : -1
        const best = Math.max(prev, takeVal)
        let color = COLORS.default
        if (canTake && best === takeVal && best > prev) color = COLORS.highlight
        return mkBar(`dp-${i}-${w}`, best, w, color, w === 0 ? `物品${i}` : undefined)
      }),
      highlights: [],
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

    // 展示更新后的 DP 行
    const rowBars: BarObject[] = dp[i].map((v, w) => {
      const prev = dp[i - 1][w]
      let color = COLORS.default
      if (v > prev) color = COLORS.highlight
      else if (v === 0 && i > 1) color = COLORS.inactive
      return mkBar(`dp-${i}-${w}`, v, w, color)
    })
    yield {
      objects: rowBars,
      highlights: [],
      codeLine: 6,
      description: `第 ${i} 行完成：最大价值 = ${dp[i][capacity]}`,
    }
  }

  // 回溯
  const selected: number[] = []
  let ci = n, cw = capacity
  while (ci > 0 && cw > 0) {
    if (dp[ci][cw] !== dp[ci - 1][cw]) {
      selected.push(ci - 1)
      cw -= weights[ci - 1]
    }
    ci--
  }

  yield {
    objects: weights.map((w, i) => {
      const isSel = selected.includes(i)
      return mkBar(
        `item-${i}`,
        values[i],
        i,
        isSel ? COLORS.sorted : COLORS.inactive,
        `w${w} v${values[i]}${isSel ? ' ✓' : ''}`
      )
    }),
    highlights: [],
    codeLine: 10,
    description: `回溯完成：选中物品 ${selected.sort((a, b) => a - b).join(', ')}（编号从0开始），最大价值 = ${dp[n][capacity]}`,
  }

  // 最终结果
  yield {
    objects: weights.map((w, i) => {
      const isSel = selected.includes(i)
      return mkBar(
        `final-${i}`,
        isSel ? values[i] : 0,
        i,
        isSel ? COLORS.sorted : COLORS.inactive,
        isSel ? `重量${w} 价值${values[i]}` : `未选`
      )
    }),
    highlights: [],
    codeLine: 11,
    description: `01 背包最终结果：总价值 = ${dp[n][capacity]}，总重量 = ${selected.reduce((s, i) => s + weights[i], 0)} / ${capacity}`,
  }
}
