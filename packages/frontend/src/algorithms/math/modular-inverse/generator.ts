import { Scene, BarObject, COLORS } from '@vsa/shared'

interface Params {
  a: number
  mod: number
}

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function modExp(base: number, exp: number, m: number): number {
  let r = 1
  let b = base % m
  while (exp > 0) {
    if (exp & 1) r = (r * b) % m
    b = (b * b) % m
    exp >>= 1
  }
  return r
}

export default function* generator(params: Params): Generator<Scene, void, unknown> {
  const a = params.a
  const mod = params.mod

  yield {
    objects: [
      mkBar('a', a, 0, COLORS.default, `a = ${a}`),
      mkBar('mod', mod, 1, COLORS.selected, `mod = ${mod}`),
      mkBar('exp', mod - 2, 2, COLORS.pivot, `p-2 = ${mod - 2}`),
    ],
    highlights: [],
    codeLine: 1,
    description: `费马小定理：a·a^(p-2) ≡ 1 (mod p)。求 ${a} 在模 ${mod} 下的逆元，即计算 ${a}^(${mod - 2}) mod ${mod}`,
  }

  let result = 1
  let base = a % mod
  let exp = mod - 2
  let step = 0

  while (exp > 0) {
    const bit = exp & 1
    if (bit === 1) {
      const prev = result
      result = (result * base) % mod
      yield {
        objects: [
          mkBar('result', prev, 0, COLORS.comparing, `旧 result = ${prev}`),
          mkBar('base', base, 1, COLORS.default, `base = ${base}`),
          mkBar('exp', exp, 2, COLORS.selected, `exp = ${exp}`),
          mkBar('bit', bit, 3, COLORS.pivot, `位 = ${bit}`),
        ],
        highlights: ['result', 'base'],
        codeLine: 4,
        description: `第 ${++step} 步：当前位=${bit}，乘入：result = ${prev} × ${base} mod ${mod} = ${result}`,
      }
    } else {
      yield {
        objects: [
          mkBar('result', result, 0, COLORS.sorted, `result = ${result}`),
          mkBar('base', base, 1, COLORS.default, `base = ${base}`),
          mkBar('exp', exp, 2, COLORS.selected, `exp = ${exp}`),
          mkBar('bit', bit, 3, COLORS.pivot, `位 = ${bit}`),
        ],
        highlights: ['exp'],
        codeLine: 4,
        description: `第 ${++step} 步：当前位=${bit}，跳过乘法`,
      }
    }
    base = (base * base) % mod
    exp >>= 1
  }

  const inv = result
  const check = (a * inv) % mod
  yield {
    objects: [
      mkBar('inv', inv, 0, COLORS.sorted, `逆元 = ${inv}`),
      mkBar('verify', check, 1, COLORS.sorted, `${a}×${inv} mod ${mod} = ${check}`),
      mkBar('base', 0, 2, COLORS.inactive, '-'),
      mkBar('exp', 0, 3, COLORS.inactive, '-'),
    ],
    highlights: ['inv', 'verify'],
    codeLine: 7,
    description: `计算完成！${a} 在模 ${mod} 下的乘法逆元为 ${inv}，验证：${a} × ${inv} mod ${mod} = ${check}`,
  }
}
