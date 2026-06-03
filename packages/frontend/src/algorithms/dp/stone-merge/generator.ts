import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* stoneMerge(params: { size: number }): Generator<Scene> {
  const n = params.size
  const stones: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 15) + 2)

  const initBars = stones.map((s, i) =>
    mkBar(`stone-${i}`, s * 3, i, COLORS.default, `${s}`)
  )
  yield {
    objects: initBars,
    highlights: [],
    codeLine: 1,
    description: `初始 ${n} 堆石子：[${stones.join(', ')}]，每次合并相邻两堆，代价为两堆之和，求最小总代价`,
  }

  const prefix: number[] = [0]
  for (const s of stones) prefix.push(prefix[prefix.length - 1] + s)

  yield {
    objects: prefix.slice(1).map((p, i) =>
      mkBar(`pref-${i}`, p, i, COLORS.comparing, `前缀和=${p}`)
    ),
    highlights: [],
    codeLine: 2,
    description: `前缀和数组：[${prefix.slice(1).join(', ')}]，用于快速计算区间和`,
  }

  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
  const split: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1))

  // 对角线初始化
  yield {
    objects: Array.from({ length: n }, (_, i) =>
      mkBar(`diag-${i}`, 0, i, COLORS.inactive, `[${i},${i}]=0`)
    ),
    highlights: [],
    codeLine: 3,
    description: `初始化：dp[i][i] = 0（单堆石子无需合并）`,
  }

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1
      const total = prefix[j + 1] - prefix[i]
      dp[i][j] = Infinity

      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + total
        if (cost < dp[i][j]) {
          dp[i][j] = cost
          split[i][j] = k
        }
      }

      // 展示当前区间及合并过程
      const bars = stones.map((s, idx) => {
        let color = COLORS.default
        if (idx >= i && idx <= j) color = COLORS.comparing
        if (idx === split[i][j] || idx === split[i][j] + 1) color = COLORS.highlight
        return mkBar(`merge-${idx}`, s * 3, idx, color,
          idx >= i && idx <= j ? String(s) : undefined
        )
      })

      yield {
        objects: bars,
        highlights: [`merge-${i}`, `merge-${j}`],
        codeLine: 7,
        description: `区间 [${i}, ${j}]（长度=${len}）：总石子=${total}，最优分割 k=${split[i][j]}，最小代价=${dp[i][j]}`,
      }
    }
  }

  // 展示一次模拟合并过程
  yield {
    objects: stones.map((s, idx) =>
      mkBar(`sim-${idx}`, s * 3, idx, idx === 0 ? COLORS.highlight : COLORS.comparing)
    ),
    highlights: ['sim-0', 'sim-1'],
    codeLine: 8,
    description: `模拟合并：先合并 [0] 和 [1] → 代价 ${stones[0] + stones[1]}`,
  }

  // 最终结果：所有石子合并后
  const totalSum = prefix[n]
  yield {
    objects: [mkBar('result', totalSum * 3, 0, COLORS.sorted, `合并总和=${totalSum}，最小代价=${dp[0][n - 1]}`)],
    highlights: ['result'],
    codeLine: 9,
    description: `区间 DP 完成！合并 ${n} 堆石子的最小总代价 = ${dp[0][n - 1]}`,
  }
}
