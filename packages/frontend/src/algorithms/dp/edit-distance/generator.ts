import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

const CHARS = 'ABCDEFGH'

export default function* editDistance(params: { size: number }): Generator<Scene> {
  const n = params.size
  const s1 = Array.from({ length: n }, () => CHARS[Math.floor(Math.random() * 8)]).join('')
  const s2 = s1.split('').map(() => CHARS[Math.floor(Math.random() * 8)]).join('')
  const m = s1.length
  const k = s2.length

  // 展示两个字符串
  const s1Bars: BarObject[] = [...s1].map((ch, i) =>
    mkBar(`s1-${i}`, ch.charCodeAt(0) - 64, i, COLORS.default, ch)
  )
  yield {
    objects: s1Bars,
    highlights: [],
    codeLine: 1,
    description: `源字符串 S1 = "${s1}"（长度=${m}），目标字符串 S2 = "${s2}"（长度=${k}）`,
  }

  const s2Bars: BarObject[] = [...s2].map((ch, i) =>
    mkBar(`s2-${i}`, ch.charCodeAt(0) - 64, i, COLORS.comparing, ch)
  )
  yield {
    objects: s2Bars,
    highlights: [],
    codeLine: 1,
    description: `目标字符串 S2 = "${s2}"，求最少编辑操作次数（插入/删除/替换）`,
  }

  // DP 表，列数取 max(m,k) + 1
  const cols = Math.max(m, k) + 1
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(k + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= k; j++) dp[0][j] = j

  // 初始化行
  const initRow = dp[0].map((v, j) => mkBar(`dp-0-${j}`, v * 3, j, COLORS.inactive, `col${j}`))
  yield {
    objects: initRow,
    highlights: [],
    codeLine: 3,
    description: `DP 表初始化：第一行 dp[0][j] = j（全部插入），第一列 dp[i][0] = i（全部删除）`,
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= k; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // 删除
          dp[i][j - 1] + 1,     // 插入
          dp[i - 1][j - 1] + 1  // 替换
        )
      }
    }

    // 展示当前行
    const row = dp[i].map((v, j) => {
      let color = COLORS.default
      if (j === 0) color = COLORS.inactive
      else if (s1[i - 1] === s2[j - 1]) color = COLORS.sorted
      else if (v === dp[i - 1][j] + 1) color = COLORS.comparing
      return mkBar(`dp-${i}-${j}`, v * 3, j, color, j > 0 ? `dp[${i}][${j}]=${v}` : undefined)
    })

    yield {
      objects: row,
      highlights: [],
      codeLine: 6,
      description: `DP 第 ${i} 行（字符 '${s1[i - 1]}' 与 S2 各字符比较）：` +
        (s1[i - 1] === s2[i - 1] ? '字符匹配！dp[i][j] = dp[i-1][j-1]' : '需要 min(删除, 插入, 替换)'),
    }
  }

  // 最终结果
  const dist = dp[m][k]
  const finalRow = dp[m].map((v, j) =>
    mkBar(
      `final-${j}`,
      v * 3,
      j,
      j === k ? COLORS.sorted : COLORS.default,
      j === k ? `编辑距离=${dist}` : undefined
    )
  )

  yield {
    objects: finalRow,
    highlights: [`final-${k}`],
    codeLine: 10,
    description: `编辑距离完成：从 "${s1}" 变为 "${s2}" 需要 ${dist} 步操作`,
  }
}
