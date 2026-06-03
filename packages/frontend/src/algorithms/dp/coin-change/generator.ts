import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

const COIN_SETS = [
  [1, 2, 5],
  [1, 3, 4],
  [2, 5, 10],
  [1, 5, 11],
]

export default function* coinChange(params: { size: number }): Generator<Scene> {
  const amount = params.size
  const coins = COIN_SETS[Math.floor(Math.random() * COIN_SETS.length)]

  // 展示硬币面值
  const coinBars = coins.map((c, i) =>
    mkBar(`coin-${i}`, c * 3, i, COLORS.default, `面值${c}`)
  )
  yield {
    objects: coinBars,
    highlights: [],
    codeLine: 1,
    description: `硬币面值：[${coins.join(', ')}]，目标金额 = ${amount}`,
  }

  const INF = 9999
  const dp: number[] = new Array(amount + 1).fill(INF)
  const choice: number[] = new Array(amount + 1).fill(0)
  dp[0] = 0

  const initDP = dp.map((v, i) =>
    mkBar(`dp-${i}`, v === INF ? 0 : v, i, v === INF ? COLORS.inactive : COLORS.default, i === 0 ? 'dp[0]' : undefined)
  )
  yield {
    objects: initDP,
    highlights: [],
    codeLine: 2,
    description: `DP 数组初始化：dp[0]=0，其余为无穷大`,
  }

  for (const c of coins) {
    for (let i = c; i <= amount; i++) {
      const prev = dp[i]
      if (dp[i - c] + 1 < dp[i]) {
        dp[i] = dp[i - c] + 1
        choice[i] = c
      }

      if (prev !== dp[i]) {
        const stepDP = dp.map((v, j) => {
          let color = COLORS.default
          if (j === i) color = COLORS.highlight
          else if (v === INF) color = COLORS.inactive
          return mkBar(`dp-${j}`, v === INF ? 0 : v, j, color, j === i ? `dp[${j}]=${v}` : undefined)
        })
        yield {
          objects: stepDP,
          highlights: [`dp-${i}`],
          codeLine: 4,
          description: `面值 ${c}：dp[${i}] = min(dp[${i}], dp[${i - c}] + 1) = ${dp[i]} 枚硬币`,
        }
      }
    }
  }

  // 结果
  const canMake = dp[amount] !== INF

  if (canMake) {
    // 回溯方案
    const result: number[] = []
    let rem = amount
    while (rem > 0) {
      result.push(choice[rem])
      rem -= choice[rem]
    }

    const resultBars = dp.map((v, j) => {
      let color = COLORS.default
      if (v === INF) color = COLORS.inactive
      else if (j === amount) color = COLORS.sorted
      return mkBar(
        `res-${j}`,
        v === INF ? 0 : v,
        j,
        color,
        j === amount ? `${dp[amount]}枚` : undefined
      )
    })

    yield {
      objects: resultBars,
      highlights: [`res-${amount}`],
      codeLine: 7,
      description: `兑换成功！最少需要 ${dp[amount]} 枚硬币，方案：[${result.join(', ')}]`,
    }
  } else {
    yield {
      objects: dp.map((v, j) => mkBar(`fail-${j}`, v === INF ? 0 : v, j, COLORS.inactive)),
      highlights: [],
      codeLine: 7,
      description: `无法凑出金额 ${amount}`,
    }
  }
}
