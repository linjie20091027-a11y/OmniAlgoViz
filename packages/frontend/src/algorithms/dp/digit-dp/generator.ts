import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function countValid(limit: number): number {
  const s = String(limit)
  const m = s.length
  // memo[pos][tight][started]
  const memo: Map<string, number> = new Map()

  function dfs(pos: number, tight: boolean, started: boolean): number {
    if (pos === m) return started ? 1 : 0
    const key = `${pos}-${tight ? 1 : 0}-${started ? 1 : 0}`
    if (memo.has(key)) return memo.get(key)!

    const limitD = tight ? parseInt(s[pos]) : 9
    let total = 0
    for (let d = 0; d <= limitD; d++) {
      if (d === 4) continue
      total += dfs(pos + 1, tight && d === limitD, started || d !== 0)
    }
    memo.set(key, total)
    return total
  }

  return dfs(0, true, false)
}

export default function* digitDp(params: { size: number }): Generator<Scene> {
  const digits = params.size
  const maxNum = Math.pow(10, digits) - 1
  const rangeStart = Math.pow(10, digits - 1)
  const rangeEnd = maxNum

  // 展示数字范围
  const rangeBars: BarObject[] = [
    mkBar('lo', rangeStart / Math.pow(10, digits - 3), 0, COLORS.default, `下界=${rangeStart}`),
    mkBar('hi', rangeEnd / Math.pow(10, digits - 3), 1, COLORS.comparing, `上界=${rangeEnd}`),
  ]
  yield {
    objects: rangeBars,
    highlights: [],
    codeLine: 1,
    description: `数位DP：统计 [${rangeStart}, ${rangeEnd}] 中不包含数字 4 的整数个数（共 ${digits} 位数）`,
  }

  const s = String(rangeEnd)
  const m = s.length

  // 逐位展示分析过程
  for (let pos = 0; pos < m; pos++) {
    const digit = parseInt(s[pos])
    const digitBars: BarObject[] = []

    // 展示当前位可选数字
    for (let d = 0; d <= 9; d++) {
      if (d === 4) {
        digitBars.push(mkBar(`d-${pos}-${d}`, 0, d, COLORS.inactive, `${d} (跳过)`))
      } else if (d <= digit) {
        digitBars.push(mkBar(`d-${pos}-${d}`, d + 1, d, d === digit ? COLORS.highlight : COLORS.default, String(d)))
      } else {
        digitBars.push(mkBar(`d-${pos}-${d}`, 0, d, COLORS.inactive, `${d} (超限)`))
      }
    }

    yield {
      objects: digitBars,
      highlights: [`d-${pos}-${digit}`],
      codeLine: 5,
      description: `第 ${pos} 位（从高位开始）：上限数字 = ${digit}，可选 0~${digit}（跳过4）`,
    }
  }

  // 逐步计数（模拟 DFS）
  const stepCounts: number[] = []
  for (let step = 0; step < m; step++) {
    const subLimit = parseInt(s.slice(0, step + 1) + '0'.repeat(m - step - 1))
    const count = countValid(subLimit)
    stepCounts.push(count)

    const countBars: BarObject[] = stepCounts.map((c, i) =>
      mkBar(`cnt-${i}`, c, i, i === step ? COLORS.highlight : COLORS.default, i === step ? `前${i + 1}位: ${c}` : undefined)
    )

    yield {
      objects: countBars,
      highlights: [`cnt-${step}`],
      codeLine: 8,
      description: `处理前 ${step + 1} 位后，范围内合法数 = ${count}`,
    }
  }

  const totalValid = countValid(rangeEnd)
  const totalRange = rangeEnd - rangeStart + 1

  yield {
    objects: [
      mkBar('total', totalRange, 0, COLORS.default, `总数=${totalRange}`),
      mkBar('valid', totalValid, 1, COLORS.sorted, `合法=${totalValid}`),
      mkBar('invalid', totalRange - totalValid, 2, COLORS.swapping, `不含法=${totalRange - totalValid}`),
    ],
    highlights: ['valid'],
    codeLine: 10,
    description: `数位DP 结果：[${rangeStart}, ${rangeEnd}] 中不含数字4的整数共 ${totalValid} 个（共 ${totalRange} 个），O(log n)`,
  }
}
