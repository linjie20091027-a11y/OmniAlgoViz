import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* stringHash(params: { size: number }): Generator<Scene> {
  const n = params.size
  const s = Array.from({ length: n }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')
  const BASE = 131
  const MOD = 1000000007

  const allBars = (highlightIdx: number[] = []) =>
    s.split('').map((c, i) => {
      let color = COLORS.default
      if (highlightIdx.includes(i)) color = COLORS.comparing
      return mkBar(`s-${i}`, c.charCodeAt(0) - 96, i, color, c)
    })

  yield { objects: allBars(), highlights: [], codeLine: 1, description: `字符串: "${s}", BASE=${BASE}, MOD=${MOD}` }

  // 构建前缀哈希数组
  const hash: number[] = new Array(n + 1).fill(0)
  const pow: number[] = new Array(n + 1).fill(1)

  for (let i = 0; i < n; i++) {
    pow[i + 1] = (pow[i] * BASE) % MOD
    hash[i + 1] = (hash[i] * BASE + s.charCodeAt(i) - 96) % MOD
  }

  // 展示每个字符的累加哈希
  for (let i = 0; i < n; i++) {
    yield {
      objects: allBars(Array.from({ length: i + 1 }, (_, j) => j)),
      highlights: [],
      codeLine: 5,
      description: `前缀[0,${i}]: hash=${hash[i + 1]}, pow[${i + 1}]=${pow[i + 1]}`,
    }
  }

  // 演示子串哈希查询
  const mid = Math.floor(n / 2)
  const len = 3
  const l = Math.max(0, mid - len), r = Math.min(n - 1, mid + len)

  if (l + len - 1 <= r) {
    const subHash = (hash[l + len] - (hash[l] * pow[len]) % MOD + MOD) % MOD

    yield {
      objects: allBars(Array.from({ length: len }, (_, j) => l + j)),
      highlights: Array.from({ length: len }, (_, j) => `s-${l + j}`),
      codeLine: 8,
      description: `子串 [${l}, ${l + len - 1}]="${s.slice(l, l + len)}" 的哈希: ${subHash}`,
    }
  }

  const finalBars = s.split('').map((c, i) =>
    mkBar(`f-${i}`, c.charCodeAt(0) - 96, i, COLORS.sorted, c)
  )
  yield {
    objects: finalBars,
    highlights: [],
    codeLine: 11,
    description: `哈希数组构建完成。任意子串[L,R]哈希 = (hash[R+1] - hash[L] * pow[R-L+1]) % MOD`,
  }
}
