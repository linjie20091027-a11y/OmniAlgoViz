import { Scene, BarObject, COLORS } from '@vsa/shared'

interface Params {
  size: number
}

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generator(params: Params): Generator<Scene, void, unknown> {
  const n = params.size
  const C: number[] = new Array(n + 1).fill(0)
  C[0] = 1

  yield {
    objects: [mkBar('C0', 1, 0, COLORS.default, 'C₀ = 1')],
    highlights: ['C0'],
    codeLine: 1,
    description: `初始化：C₀ = 1（空序列/空括号只有一种方案）`,
  }

  for (let i = 1; i <= n; i++) {
    yield {
      objects: C.slice(0, i).map((v, j) =>
        mkBar(`C${j}`, v, j, COLORS.default, j === i - 1 ? `C${j}` : `C${j}=${v}`)
      ),
      highlights: [],
      codeLine: 3,
      description: `开始计算 C${i}，已有 C₀~C${i - 1}`,
    }

    let sum = 0
    for (let j = 0; j < i; j++) {
      const term = C[j] * C[i - 1 - j]
      sum += term
      yield {
        objects: [
          ...C.slice(0, i).map((v, k) =>
            mkBar(`C${k}`, v, k, COLORS.inactive, `C${k}=${v}`)
          ),
          mkBar(`term`, term, i, COLORS.comparing, `C${j}×C${i - 1 - j}=${term}`),
          mkBar(`sum`, sum, i + 1, COLORS.pivot, `部分和=${sum}`),
        ],
        highlights: [`C${j}`, `C${i - 1 - j}`, 'term'],
        codeLine: 4,
        description: `计算项：C₍${j}₎ × C₍${i - 1 - j}₎ = ${C[j]} × ${C[i - 1 - j]} = ${term}，累加到 sum = ${sum}`,
      }
    }

    C[i] = sum
    yield {
      objects: C.slice(0, i + 1).map((v, j) =>
        mkBar(
          `C${j}`,
          v,
          j,
          j === i ? COLORS.sorted : COLORS.default,
          j === i ? `C${j} = ${v}` : `C${j}=${v}`
        )
      ),
      highlights: [`C${i}`],
      codeLine: 5,
      description: `C${i} 计算完成 = ${sum}（绿色高亮）`,
    }
  }

  yield {
    objects: C.map((v, i) =>
      mkBar(`C${i}`, v, i, COLORS.sorted, `C${i}=${v}`)
    ),
    highlights: C.map((_, i) => `C${i}`),
    codeLine: 6,
    description: `卡特兰数列 C₀~C${n} = ${C.join(', ')}`,
  }
}
