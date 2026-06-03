import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function manacher(s: string): [number[], number, number] {
  const t = '#' + s.split('').join('#') + '#'
  const n = t.length
  const p = new Array(n).fill(0)
  let c = 0, r = 0
  for (let i = 0; i < n; i++) {
    if (i < r) p[i] = Math.min(r - i, p[2 * c - i])
    // expand
    let ex = p[i]
    while (i - ex - 1 >= 0 && i + ex + 1 < n && t[i - ex - 1] === t[i + ex + 1]) ex++
    p[i] = ex
    if (i + ex > r) { c = i; r = i + ex }
  }
  let maxLen = 0, center = 0
  for (let i = 0; i < n; i++) {
    if (p[i] > maxLen) { maxLen = p[i]; center = i }
  }
  return [p, center, maxLen]
}

export default function* manacherAlgo(params: { size: number }): Generator<Scene> {
  const n = params.size
  const chars = 'abcbadeffg'.slice(0, n)
  const s = chars.length < n ? chars + Array.from({ length: n - chars.length }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('') : chars

  const rawBars = s.split('').map((c, i) => mkBar(`c-${i}`, c.charCodeAt(0) - 96, i, COLORS.default, c))
  yield { objects: rawBars, highlights: [], codeLine: 1, description: `原始字符串: "${s}"` }

  // 预处理字符串
  const t = '#' + s.split('').join('#') + '#'
  const processed = t.split('').map((c, i) => {
    const val = c === '#' ? 0 : c.charCodeAt(0) - 96
    return mkBar(`t-${i}`, val, i, c === '#' ? COLORS.inactive : COLORS.default, c)
  })
  yield { objects: processed, highlights: [], codeLine: 2, description: `预处理: "${t}"，插入#分隔符消除奇偶性` }

  const [p, center, maxLen] = manacher(s)

  // 显示半径数组
  const radiusBars = t.split('').map((c, i) => {
    const val = c === '#' ? 0 : c.charCodeAt(0) - 96
    let color = COLORS.default
    if (p[i] === maxLen) color = COLORS.highlight
    if (c === '#') color = COLORS.inactive
    return mkBar(`r-${i}`, p[i], i, color, `${c} r=${p[i]}`)
  })
  yield { objects: radiusBars, highlights: [`r-${center}`], codeLine: 5, description: `回文半径数组，中心 ${center}，半径 ${maxLen}` }

  // 展示最长回文
  const start = Math.floor((center - maxLen) / 2)
  const len = maxLen
  const finalBars = s.split('').map((c, i) => {
    let color = COLORS.default
    if (i >= start && i < start + len) color = COLORS.sorted
    return mkBar(`f-${i}`, c.charCodeAt(0) - 96, i, color, c)
  })
  yield { objects: finalBars, highlights: [], codeLine: 7, description: `最长回文子串: "${s.slice(start, start + len)}"，长度 ${len}` }
}
