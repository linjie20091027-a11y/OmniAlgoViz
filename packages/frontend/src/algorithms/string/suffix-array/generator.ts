import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* suffixArray(params: { size: number }): Generator<Scene> {
  const n = params.size
  const s = 'banana'.slice(0, Math.min(6, n)) +
    Array.from({ length: Math.max(0, n - 6) }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')

  const N = s.length
  const rk = new Array(N).fill(0)
  const sa = new Array(N).fill(0)
  const tmp = new Array(N).fill(0)

  // 初始排序
  const chars = s.split('').map((c, i) => mkBar(`s-${i}`, c.charCodeAt(0) - 96, i, COLORS.default, c))
  yield { objects: chars, highlights: [], codeLine: 1, description: `字符串: "${s}"，准备排序后缀` }

  // 初始化排名
  for (let i = 0; i < N; i++) { rk[i] = s.charCodeAt(i) - 96; sa[i] = i }

  const suffixBars = (title: string, k: number) => {
    const bars: BarObject[] = []
    for (let i = 0; i < N; i++) {
      const idx = sa[i]
      bars.push(mkBar(`sa-${i}`, rk[idx], idx, i < 3 ? COLORS.sorted : COLORS.default, `后缀${idx}:${s.slice(idx)}`))
    }
    return bars
  }

  for (let w = 1; w < 2 * N; w <<= 1) {
    // 按第二关键字排序
    sa.sort((a, b) => {
      if (rk[a] !== rk[b]) return rk[a] - rk[b]
      const ra = a + w < N ? rk[a + w] : -1
      const rb = b + w < N ? rk[b + w] : -1
      return ra - rb
    })

    tmp[sa[0]] = 0
    for (let i = 1; i < N; i++) {
      tmp[sa[i]] = tmp[sa[i - 1]] +
        (rk[sa[i]] !== rk[sa[i - 1]] ||
          (sa[i] + w < N ? rk[sa[i] + w] : -1) !== (sa[i - 1] + w < N ? rk[sa[i - 1] + w] : -1) ? 1 : 0)
    }
    for (let i = 0; i < N; i++) rk[i] = tmp[i]

    yield {
      objects: suffixBars(`倍增 w=${w}`, w),
      highlights: Array.from({ length: Math.min(3, N) }, (_, i) => `sa-${i}`),
      codeLine: 8,
      description: `倍增步长 w=${w}，前3后缀: ${sa.slice(0, 3).map(i => s.slice(i)).join(', ')}`,
    }

    if (rk[sa[N - 1]] === N - 1) break
  }

  const finalBars: BarObject[] = []
  for (let i = 0; i < N; i++) {
    finalBars.push(mkBar(`sf-${i}`, rk[sa[i]], sa[i], COLORS.sorted, `第${i + 1}:${s.slice(sa[i])}`))
  }
  yield { objects: finalBars, highlights: [], codeLine: 15, description: '后缀数组排序完成' }
}
