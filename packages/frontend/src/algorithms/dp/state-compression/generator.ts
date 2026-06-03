import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* tspDp(params: { size: number }): Generator<Scene> {
  const n = params.size

  // 生成随机距离矩阵（对称）
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = Math.floor(Math.random() * 50) + 10
      dist[i][j] = d
      dist[j][i] = d
    }
  }

  // 展示距离矩阵
  const matrixBars: BarObject[] = []
  let idx = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      matrixBars.push(
        mkBar(`dist-${i}-${j}`, i === j ? 0 : dist[i][j], idx++,
          i === j ? COLORS.inactive : (i < j ? COLORS.default : COLORS.comparing),
          i !== j ? `${i}→${j}:${dist[i][j]}` : undefined)
      )
    }
  }
  yield {
    objects: matrixBars,
    highlights: [],
    codeLine: 1,
    description: `${n} 个城市 TSP 问题，距离矩阵如上，从城市 0 出发，求最短哈密顿回路`,
  }

  const states = 1 << n
  const INF = 999999
  const dp: number[][] = Array.from({ length: states }, () => new Array(n).fill(INF))
  dp[1][0] = 0

  // 展示空状态
  yield {
    objects: [mkBar('start', 0, 0, COLORS.sorted, 'dp[{0}][0]=0')],
    highlights: ['start'],
    codeLine: 2,
    description: `初始化：dp[mask={0}][0] = 0（已访问城市 0，位于城市 0，代价为 0）`,
  }

  // 按 mask 的 bit 数量枚举（宽度优先的感觉）
  type State = { mask: number; i: number; val: number }
  const generated: State[] = []

  for (let mask = 1; mask < states; mask++) {
    if ((mask & 1) === 0) continue // 必须包含城市 0

    for (let i = 0; i < n; i++) {
      if (!(mask & (1 << i)) || dp[mask][i] >= INF) continue

      for (let j = 0; j < n; j++) {
        if (mask & (1 << j)) continue
        const newMask = mask | (1 << j)
        const newVal = dp[mask][i] + dist[i][j]
        if (newVal < dp[newMask][j]) {
          dp[newMask][j] = newVal
          generated.push({ mask: newMask, i: j, val: newVal })
        }
      }
    }

    // 展示当前 mask 对应的状态
    if (generated.length > 0) {
      const barBatch = generated.slice(0, 20).map((s, idx) => {
        const maskStr = s.mask.toString(2).padStart(n, '0')
        return mkBar(
          `st-${idx}`,
          s.val,
          idx,
          s.val < 500 ? COLORS.default : COLORS.highlight,
          `mask=${maskStr} i=${s.i}`
        )
      })

      if (barBatch.length > 0) {
        yield {
          objects: barBatch,
          highlights: barBatch.length === 1 ? ['st-0'] : [],
          codeLine: 7,
          description: `mask=${mask} (${mask.toString(2).padStart(n, '0')})：已访问 ${popcount(mask)} 个城市，DP 状态更新中`,
        }
      }
      generated.length = 0
    }
  }

  // 回到起点
  const fullMask = states - 1
  let best = INF
  for (let i = 1; i < n; i++) {
    best = Math.min(best, dp[fullMask][i] + dist[i][0])
  }

  // 展示最终结果
  yield {
    objects: n > 0 ? [
      mkBar('best', best, 0, COLORS.sorted, `最短路径=${best}`),
      ...Array.from({ length: n - 1 }, (_, i) =>
        mkBar(`city-${i}`, dist[0][i + 1], i + 1, COLORS.default, `0→${i + 1}`)
      ),
    ] : [],
    highlights: ['best'],
    codeLine: 11,
    description: `状压DP完成！最短哈密顿回路长度 = ${best}（共 ${states} 个状态，每个状态 n 个位置，O(2^n·n²)）`,
  }
}

function popcount(x: number): number {
  let c = 0
  while (x) { c += x & 1; x >>= 1 }
  return c
}
