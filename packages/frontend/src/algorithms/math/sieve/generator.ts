import { Scene, BarObject, COLORS } from '@vsa/shared'

interface Params {
  size: number
}

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generator(params: Params): Generator<Scene, void, unknown> {
  const n = params.size
  const isPrime = new Array(n + 1).fill(true)
  isPrime[0] = isPrime[1] = false

  function makeScene(desc: string, highlights: string[], codeLine: number): Scene {
    const bars = new Array(n + 1).fill(null).map((_, i) => {
      if (i < 2) return mkBar(`b${i}`, 0, i, COLORS.inactive, i.toString())
      return mkBar(`b${i}`, isPrime[i] ? 1 : 0, i, isPrime[i] ? COLORS.default : COLORS.inactive, i.toString())
    })
    return { objects: bars, highlights, codeLine, description: desc }
  }

  yield { ...makeScene(`初始化：假设 2~${n} 全部为素数`, [], 1), codeLine: 1 }
  yield { ...makeScene(`标记 0 和 1 为非素数`, ['b0', 'b1'], 2), codeLine: 2 }

  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      yield { ...makeScene(`检查 p=${p}，是素数，开始筛掉其倍数`, [`b${p}`], 4), codeLine: 4 }

      for (let m = p * p; m <= n; m += p) {
        isPrime[m] = false
        yield {
          ...makeScene(`筛掉 ${m}（${p}×${m / p}），标记为非素数`, [`b${p}`, `b${m}`], 5),
          codeLine: 5,
        }
      }
      yield { ...makeScene(`p=${p} 的倍数全部筛除完毕`, [], 6), codeLine: 6 }
    } else {
      yield { ...makeScene(`p=${p} 已被标记为非素数，跳过`, [`b${p}`], 3), codeLine: 3 }
    }
  }

  const primeIds = new Array(n + 1).fill(0)
    .map((_, i) => (isPrime[i] ? `b${i}` : null))
    .filter(Boolean) as string[]

  yield {
    ...makeScene(`筛选完成！1~${n} 中共 ${primeIds.length} 个素数`, primeIds, 7),
    codeLine: 7,
  }

  const final = new Array(n + 1).fill(null).map((_, i) => {
    if (i < 2) return mkBar(`b${i}`, 0, i, COLORS.inactive, i.toString())
    return mkBar(
      `b${i}`,
      isPrime[i] ? i : 0,
      i,
      isPrime[i] ? COLORS.sorted : COLORS.inactive,
      i.toString()
    )
  })
  yield { objects: final, highlights: primeIds, codeLine: 8, description: `素数展示（绿色柱高=素数值）：${primeIds.map(id => id.replace('b', '')).join(', ')}` }
}
