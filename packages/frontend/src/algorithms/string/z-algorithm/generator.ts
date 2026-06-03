import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function calcZ(s: string): number[] {
  const n = s.length
  const z = new Array(n).fill(0)
  let l = 0, r = 0
  for (let i = 1; i < n; i++) {
    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l])
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++
    if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1 }
  }
  return z
}

export default function* zAlgorithm(params: { size: number }): Generator<Scene> {
  const n = params.size
  const s = 'aabaabcda'.slice(0, Math.min(9, n)) +
    Array.from({ length: Math.max(0, n - 9) }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')

  const allBars = () => s.split('').map((c, i) => mkBar(`s-${i}`, c.charCodeAt(0) - 96, i, COLORS.default, c))
  yield { objects: allBars(), highlights: [], codeLine: 1, description: `字符串: "${s}"` }

  const z = new Array(n).fill(0)
  let l = 0, r = 0

  for (let i = 1; i < n; i++) {
    if (i <= r) {
      z[i] = Math.min(r - i + 1, z[i - l])
      yield {
        objects: s.split('').map((c, j) => {
          let color = COLORS.default
          if (j === i) color = COLORS.comparing
          if (j >= l && j <= r) color = COLORS.pointer
          return mkBar(`s-${j}`, c.charCodeAt(0) - 96, j, color, c)
        }),
        highlights: [`s-${i}`],
        codeLine: 5,
        description: `Z-box [${l}, ${r}] 复用: z[${i}] = min(${r - i + 1}, z[${i - l}]) = ${z[i]}`,
      }
    }

    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
      z[i]++
      yield {
        objects: s.split('').map((c, j) => {
          let color = COLORS.default
          if (j === i + z[i] - 1) color = COLORS.comparing
          if (j === z[i] - 1) color = COLORS.highlight
          return mkBar(`s-${j}`, c.charCodeAt(0) - 96, j, color, c)
        }),
        highlights: [`s-${i + z[i] - 1}`, `s-${z[i] - 1}`],
        codeLine: 6,
        description: `扩展: s[${z[i] - 1}] == s[${i + z[i] - 1}]，z[${i}] = ${z[i]}`,
      }
    }

    if (i + z[i] - 1 > r) {
      l = i; r = i + z[i] - 1
      yield {
        objects: s.split('').map((c, j) => {
          let color = COLORS.default
          if (j === i) color = COLORS.comparing
          if (j >= l && j <= r) color = COLORS.pointer
          return mkBar(`s-${j}`, c.charCodeAt(0) - 96, j, color, c)
        }),
        highlights: [],
        codeLine: 8,
        description: `更新 Z-box: [${l}, ${r}]`,
      }
    }
  }

  const zBars = s.split('').map((c, i) =>
    mkBar(`z-${i}`, z[i], i, i === 0 ? COLORS.inactive : z[i] > 0 ? COLORS.sorted : COLORS.default, `Z=${z[i]}`)
  )
  yield { objects: zBars, highlights: [], codeLine: 11, description: 'Z函数计算完成' }
}
