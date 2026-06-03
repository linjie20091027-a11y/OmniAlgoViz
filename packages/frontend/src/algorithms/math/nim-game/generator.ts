import { Scene, BarObject, COLORS } from '@vsa/shared'

interface Params {
  size: number
}

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

export default function* generator(params: Params): Generator<Scene, void, unknown> {
  const n = params.size
  const rand = seededRandom(n * 100 + 1)
  const piles: number[] = []
  for (let i = 0; i < n; i++) {
    piles.push(Math.floor(rand() * 15) + 1)
  }

  yield {
    objects: piles.map((v, i) =>
      mkBar(`p${i}`, v, i, COLORS.default, `堆${i + 1}=${v}`)
    ),
    highlights: [],
    codeLine: 1,
    description: `Nim 游戏：共 ${n} 堆石子，数量分别为 ${piles.join(', ')}`,
  }

  let xorSum = 0
  for (let i = 0; i < n; i++) {
    const prev = xorSum
    xorSum ^= piles[i]
    yield {
      objects: piles.map((v, j) =>
        mkBar(`p${j}`, v, j, j === i ? COLORS.comparing : COLORS.default, `堆${j + 1}=${v}`)
      ),
      highlights: [`p${i}`],
      codeLine: 3,
      description: `XOR 累加：${prev} ⊕ ${piles[i]} = ${xorSum}`,
    }
  }

  yield {
    objects: piles.map((v, i) =>
      mkBar(`p${i}`, v, i, COLORS.default, `堆${i + 1}=${v}`)
    ),
    highlights: [],
    codeLine: 4,
    description: `所有堆的异或和 = ${xorSum}`,
  }

  let found = false
  for (let i = 0; i < n; i++) {
    const target = piles[i] ^ xorSum
    if (target < piles[i]) {
      found = true
      yield {
        objects: piles.map((v, j) =>
          mkBar(
            `p${j}`,
            j === i ? target : v,
            j,
            j === i ? COLORS.sorted : COLORS.default,
            j === i ? `${piles[i]}→${target}` : `堆${j + 1}=${v}`
          )
        ),
        highlights: [`p${i}`],
        codeLine: 5,
        description: `必胜策略：第 ${i + 1} 堆从 ${piles[i]} 取到 ${target}（取走 ${piles[i] - target} 颗）`,
      }
      break
    }
  }

  if (!found) {
    yield {
      objects: piles.map((v, i) =>
        mkBar(`p${i}`, v, i, COLORS.comparing, `堆${i + 1}=${v}`)
      ),
      highlights: [],
      codeLine: 6,
      description: `异或和为 ${xorSum} ≠ 0，但没有必胜走法（说明局面为必败态）`,
    }
  }
}
