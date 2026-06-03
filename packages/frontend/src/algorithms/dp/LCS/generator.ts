import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

const CHARS = 'ABCDEFGH'

export default function* lcs(params: { size: number }): Generator<Scene> {
  const n = params.size
  const s1 = Array.from({ length: n }, () => CHARS[Math.floor(Math.random() * 8)]).join('')
  const s2 = Array.from({ length: n }, () => CHARS[Math.floor(Math.random() * 8)]).join('')

  // 展示字符串 s1
  const s1Bars: BarObject[] = [...s1].map((ch, i) =>
    mkBar(`s1-${i}`, ch.charCodeAt(0) - 64, i, COLORS.default, ch)
  )
  yield {
    objects: s1Bars,
    highlights: [],
    codeLine: 1,
    description: `字符串 S1 = "${s1}"，长度 = ${n}`,
  }

  // 切换展示 s2
  const s2Bars: BarObject[] = [...s2].map((ch, i) =>
    mkBar(`s2-${i}`, ch.charCodeAt(0) - 64, i, COLORS.comparing, ch)
  )
  yield {
    objects: s2Bars,
    highlights: [],
    codeLine: 1,
    description: `字符串 S2 = "${s2}"，长度 = ${n}`,
  }

  const m = n
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(m + 1).fill(0))

  // 逐行填充 DP 表
  for (let i = 1; i <= m; i++) {
    const row: BarObject[] = []
    for (let j = 0; j <= m; j++) {
      if (j === 0) {
        row.push(mkBar(`dp-${i}-${j}`, 0, j, COLORS.inactive))
      } else {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
        let color = COLORS.default
        if (s1[i - 1] === s2[j - 1]) color = COLORS.highlight
        row.push(mkBar(`dp-${i}-${j}`, dp[i][j], j, color))
      }
    }

    yield {
      objects: row,
      highlights: [],
      codeLine: 4,
      description: `DP 第 ${i} 行：S1[${i - 1}]='${s1[i - 1]}' 与 S2 各字符比较${s1[i - 1] === s2[i - 1] ? '（字符相同！）' : ''}`,
    }
  }

  // 回溯找 LCS
  let ci = m, cj = m
  const lcsChars: string[] = []
  const trace: { i: number; j: number }[] = []

  while (ci > 0 && cj > 0) {
    if (s1[ci - 1] === s2[cj - 1]) {
      lcsChars.push(s1[ci - 1])
      trace.push({ i: ci, j: cj })
      ci--
      cj--
    } else if (dp[ci - 1][cj] >= dp[ci][cj - 1]) {
      ci--
    } else {
      cj--
    }
  }
  const lcsStr = lcsChars.reverse().join('')

  // 展示 LCS 对应位置
  const resultBars: BarObject[] = [...s1].map((ch, i) => {
    const inLcs = lcsStr.includes(ch) && trace.some(t => t.i === i + 1)
    return mkBar(
      `res-${i}`,
      ch.charCodeAt(0) - 64,
      i,
      inLcs ? COLORS.sorted : COLORS.inactive,
      inLcs ? ch : ''
    )
  })

  yield {
    objects: resultBars,
    highlights: [],
    codeLine: 10,
    description: `LCS = "${lcsStr}"，长度 = ${dp[m][m]}，高亮字符为公共子序列`,
  }

  yield {
    objects: dp[m].map((v, j) => mkBar(`final-${j}`, v, j, COLORS.sorted)),
    highlights: [],
    codeLine: 10,
    description: `最终结果：LCS 长度 = ${dp[m][m]}，即 S1 和 S2 的最长公共子序列`,
  }
}
