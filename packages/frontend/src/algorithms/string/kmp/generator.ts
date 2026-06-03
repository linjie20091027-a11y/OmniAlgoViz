import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* kmp(params: { size: number }): Generator<Scene> {
  const n = params.size
  const text = Array.from({ length: n }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')
  const m = Math.max(2, Math.floor(n / 3))
  const pattern = text.slice(Math.floor(n / 4), Math.floor(n / 4) + m)

  const textBars = (tIdx: number, pIdx: number, skip: number[] = []) =>
    text.split('').map((c, i) => {
      let color = COLORS.default
      if (i === tIdx) color = COLORS.comparing
      if (skip.includes(i)) color = COLORS.sorted
      return mkBar(`t-${i}`, c.charCodeAt(0) - 96, i, color, c)
    })

  yield { objects: textBars(-1, -1), highlights: [], codeLine: 1, description: `文本: "${text}", 模式串: "${pattern}"` }

  // 构建前缀函数 pi
  const pi: number[] = new Array(m).fill(0)
  yield { objects: pattern.split('').map((c, i) => mkBar(`p-${i}`, c.charCodeAt(0) - 96, i, COLORS.default, c)), highlights: [], codeLine: 2, description: '开始构建前缀函数 π' }

  for (let i = 1; i < m; i++) {
    let j = pi[i - 1]
    while (j > 0 && pattern[i] !== pattern[j]) {
      yield {
        objects: pattern.split('').map((c, k) =>
          mkBar(`p-${k}`, c.charCodeAt(0) - 96, k, k === i ? COLORS.comparing : k === j ? COLORS.swapping : COLORS.default, c)
        ),
        highlights: [`p-${i}`, `p-${j}`],
        codeLine: 5,
        description: `pattern[${i}]="${pattern[i]}" ≠ pattern[${j}]="${pattern[j]}"，回退 j=π[${j - 1}]`,
      }
      j = pi[j - 1]
    }
    if (pattern[i] === pattern[j]) j++
    pi[i] = j
    yield {
      objects: pattern.split('').map((c, k) =>
        mkBar(`p-${k}`, c.charCodeAt(0) - 96, k, k <= i ? COLORS.sorted : COLORS.default, c)
      ),
      highlights: [`p-${i}`],
      codeLine: 8,
      description: `π[${i}] = ${j}`,
    }
  }

  // KMP 匹配
  const skipPos: number[] = []
  let i = 0, j = 0
  while (i < n) {
    yield {
      objects: textBars(i, j, skipPos),
      highlights: [`t-${i}`],
      codeLine: 12,
      description: `比较 text[${i}]="${text[i]}" 和 pattern[${j}]="${pattern[j]}"`,
    }
    while (j > 0 && text[i] !== pattern[j]) {
      j = pi[j - 1]
      yield {
        objects: textBars(i, j, skipPos),
        highlights: [`t-${i}`],
        codeLine: 14,
        description: `不匹配！利用 π 跳过，j = π[${j > 0 ? '...' : ''}] = ${j}`,
      }
    }
    if (text[i] === pattern[j]) j++
    if (j === m) {
      const start = i - m + 1
      skipPos.push(start)
      yield {
        objects: textBars(i, j, skipPos),
        highlights: Array.from({ length: m }, (_, k) => `t-${start + k}`),
        codeLine: 17,
        description: `✓ 在位置 ${start} 找到匹配！`,
      }
      j = pi[j - 1]
    }
    i++
  }

  const resultBars = text.split('').map((c, idx) =>
    mkBar(`t-${idx}`, c.charCodeAt(0) - 96, idx, skipPos.includes(idx) ? COLORS.sorted : COLORS.default, c)
  )
  yield { objects: resultBars, highlights: [], codeLine: 20, description: `匹配完成，共找到 ${skipPos.length} 处匹配` }
}
