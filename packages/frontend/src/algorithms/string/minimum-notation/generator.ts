import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* minimumNotation(params: { size: number }): Generator<Scene> {
  const n = params.size
  const s = Array.from({ length: n }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')

  const allBars = (a: number, b: number, k: number) =>
    s.split('').map((c, i) => {
      let color = COLORS.default
      if (i === a) color = COLORS.comparing
      if (i === b) color = COLORS.pointer
      if (i >= a && i < a + k) color = COLORS.comparing
      if (i >= b && i < b + k) color = COLORS.pointer
      return mkBar(`s-${i}`, c.charCodeAt(0) - 96, i, color, c)
    })

  yield { objects: allBars(-1, -1, 0), highlights: [], codeLine: 1, description: `原始字符串: "${s}"，求最小循环表示` }

  const t = s + s
  let i = 0, j = 1, k = 0

  yield {
    objects: allBars(i % n, j % n, k),
    highlights: [],
    codeLine: 3,
    description: `初始化双指针: i=${i}, j=${j}, k=${k}`,
  }

  while (i < n && j < n && k < n) {
    const match = t[i + k] === t[j + k]
    if (match) {
      k++
      yield {
        objects: allBars((i + k - 1) % n, (j + k - 1) % n, k),
        highlights: [],
        codeLine: 7,
        description: `t[${i + k - 1}] == t[${j + k - 1}]，k++ → ${k}`,
      }
    } else if (t[i + k] > t[j + k]) {
      yield {
        objects: allBars(i % n, j % n, k),
        highlights: [`s-${i % n}`],
        codeLine: 9,
        description: `t[${i + k}] > t[${j + k}]，i 跳到 ${i + k + 1}`,
      }
      i += k + 1
      if (i <= j) i = j + 1
      k = 0
    } else {
      yield {
        objects: allBars(i % n, j % n, k),
        highlights: [`s-${j % n}`],
        codeLine: 12,
        description: `t[${j + k}] > t[${i + k}]，j 跳到 ${j + k + 1}`,
      }
      j += k + 1
      if (j <= i) j = i + 1
      k = 0
    }
  }

  const start = Math.min(i, j)
  const result = s.slice(start) + s.slice(0, start)

  const finalBars = s.split('').map((c, idx) => {
    const pos = (idx - start + n) % n
    return mkBar(`f-${idx}`, c.charCodeAt(0) - 96, idx, idx === start ? COLORS.sorted : COLORS.default, c)
  })
  yield { objects: finalBars, highlights: [`f-${start}`], codeLine: 18, description: `最小表示: "${result}"，起始位置: ${start}` }
}
