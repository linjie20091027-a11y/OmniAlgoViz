import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* matrixChain(params: { size: number }): Generator<Scene> {
  const n = params.size
  const dims: number[] = [Math.floor(Math.random() * 15) + 5]
  for (let i = 0; i < n; i++) {
    dims.push(Math.floor(Math.random() * 15) + 5)
  }

  // 展示维度信息
  const dimBars: BarObject[] = dims.map((d, i) =>
    mkBar(`dim-${i}`, d, i, COLORS.default, i < n ? `A${i}: ${dims[i]}x${dims[i + 1]}` : `p${i}=${d}`)
  )
  yield {
    objects: dimBars,
    highlights: [],
    codeLine: 1,
    description: `矩阵维度 p = [${dims.join(', ')}]，共 ${n} 个矩阵，求最小乘法次数`,
  }

  // dp[i][j] = 矩阵 i 到 j 的最小乘法次数
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
  const split: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1))

  // 对角线初始化
  yield {
    objects: dp.map((row, i) =>
      mkBar(`init-${i}`, 0, i, COLORS.inactive, `A${i}自乘=0`)
    ),
    highlights: [],
    codeLine: 2,
    description: `初始化：对角线 dp[i][i] = 0（单个矩阵无需乘法）`,
  }

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1
      dp[i][j] = Infinity

      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
        if (cost < dp[i][j]) {
          dp[i][j] = cost
          split[i][j] = k
        }
      }

      // 展示当前区间计算结果
      const intervalBars: BarObject[] = []
      let idx = 0
      for (let a = 0; a < n; a++) {
        for (let b = a; b < n; b++) {
          if (dp[a][b] > 0 && dp[a][b] < Infinity) {
            intervalBars.push(
              mkBar(
                `dp-${a}-${b}`,
                Math.min(dp[a][b] / 10, 100),
                idx++,
                a === i && b === j ? COLORS.highlight : COLORS.default,
                `A${a}..A${b}=${dp[a][b]}`
              )
            )
          }
        }
      }

      yield {
        objects: intervalBars.slice(Math.max(0, intervalBars.length - 15)),
        highlights: [`dp-${i}-${j}`],
        codeLine: 7,
        description: `区间 A${i}..A${j}（长度=${len}）：最优分割 k=${split[i][j]}，代价=${dp[i][j]}`,
      }
    }
  }

  const minCost = dp[0][n - 1]

  // 构造括号化
  function buildParen(i: number, j: number): string {
    if (i === j) return `A${i}`
    const k = split[i][j]
    return `(${buildParen(i, k)} × ${buildParen(k + 1, j)})`
  }

  const paren = buildParen(0, n - 1)

  // 最终结果
  const costBars: BarObject[] = []
  for (let i = 0; i < n - 1; i++) {
    costBars.push(mkBar(`cost-${i}`, dims[i] * dims[i + 1], i, COLORS.sorted, `A${i}xA${i + 1}`))
  }

  yield {
    objects: costBars,
    highlights: [],
    codeLine: 9,
    description: `最优括号化：${paren}，最小标量乘法次数 = ${minCost}，O(n³)`,
  }
}
