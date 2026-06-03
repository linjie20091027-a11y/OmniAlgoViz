import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* rabinKarp(params: { size: number }): Generator<Scene> {
  const n = params.size
  const text = Array.from({ length: n }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')
  const m = Math.max(2, Math.floor(n / 3))
  const pattern = text.slice(Math.floor(n / 4), Math.floor(n / 4) + m)
  const BASE = 31

  yield {
    objects: text.split('').map((c, i) => mkBar(`t-${i}`, c.charCodeAt(0) - 96, i, COLORS.default, c)),
    highlights: [],
    codeLine: 1,
    description: `文本: "${text}", 模式串: "${pattern}", 基数 BASE=${BASE}`,
  }

  // 计算模式串hash
  let patternHash = 0
  for (let i = 0; i < m; i++) {
    patternHash = patternHash * BASE + (pattern.charCodeAt(i) - 96)
    yield {
      objects: pattern.split('').map((c, j) =>
        mkBar(`p-${j}`, c.charCodeAt(0) - 96, j, j <= i ? COLORS.sorted : COLORS.default, c)
      ),
      highlights: [`p-${i}`],
      codeLine: 4,
      description: `计算模式串哈希: h = ${patternHash}`,
    }
  }

  // 预计算最高位乘数
  let highPow = 1
  for (let i = 0; i < m - 1; i++) highPow *= BASE

  // 计算文本窗口哈希
  let windowHash = 0
  const matches: number[] = []

  for (let i = 0; i < n; i++) {
    if (i < m) {
      windowHash = windowHash * BASE + (text.charCodeAt(i) - 96)
    } else {
      windowHash = (windowHash - (text.charCodeAt(i - m) - 96) * highPow) * BASE + (text.charCodeAt(i) - 96)
    }

    const textBars = text.split('').map((c, j) => {
      let color = COLORS.default
      if (matches.includes(j)) color = COLORS.sorted
      if (j >= i - m + 1 && j <= i && i >= m - 1) color = COLORS.comparing
      return mkBar(`t-${j}`, c.charCodeAt(0) - 96, j, color, c)
    })

    if (i >= m - 1) {
      yield {
        objects: textBars,
        highlights: [],
        codeLine: 8,
        description: `窗口 [${i - m + 1}, ${i}]: hash=${windowHash}, 模式hash=${patternHash}`,
      }

      if (windowHash === patternHash) {
        let match = true
        for (let k = 0; k < m; k++) {
          if (text[i - m + 1 + k] !== pattern[k]) { match = false; break }
        }
        if (match) {
          matches.push(i - m + 1)
          yield {
            objects: textBars,
            highlights: Array.from({ length: m }, (_, k) => `t-${i - m + 1 + k}`),
            codeLine: 10,
            description: `✓ 哈希匹配！位置 ${i - m + 1} 确认匹配`,
          }
        }
      }
    }
  }

  const finalBars = text.split('').map((c, i) =>
    mkBar(`t-${i}`, c.charCodeAt(0) - 96, i, matches.includes(i) ? COLORS.sorted : COLORS.default, c)
  )
  yield { objects: finalBars, highlights: [], codeLine: 15, description: `搜索完成，共找到 ${matches.length} 处匹配` }
}
