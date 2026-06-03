import { Scene, BarObject, COLORS } from '@vsa/shared'

interface Params {
  a: number
  b: number
}

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generator(params: Params): Generator<Scene, void, unknown> {
  let a = params.a
  let b = params.b

  function makeScene(av: number, bv: number, desc: string, hl: string[], cl: number): Scene {
    return {
      objects: [
        mkBar('a', av, 0, COLORS.default, `a = ${av}`),
        mkBar('b', bv, 1, COLORS.selected, `b = ${bv}`),
        mkBar('r', av % bv || bv, 2, COLORS.pivot, `余数`),
      ],
      highlights: hl,
      codeLine: cl,
      description: desc,
    }
  }

  yield makeScene(a, b, `初始值：a = ${a}，b = ${b}`, [], 1)

  while (b !== 0) {
    const r = a % b
    yield makeScene(a, b, `计算 a % b = ${a} % ${b} = ${r}`, ['a', 'b', 'r'], 3)
    a = b
    b = r
    if (b !== 0) {
      yield makeScene(a, b, `更新：新 a = ${a}，新 b = ${b}，继续迭代`, ['a', 'b'], 4)
    }
  }

  yield {
    objects: [
      mkBar('a', a, 0, COLORS.sorted, `gcd = ${a}`),
      mkBar('b', 0, 1, COLORS.inactive, 'b = 0'),
      mkBar('empty', 0, 2, COLORS.inactive, '-'),
    ],
    highlights: ['a'],
    codeLine: 5,
    description: `最大公约数为 ${a}`,
  }
}
