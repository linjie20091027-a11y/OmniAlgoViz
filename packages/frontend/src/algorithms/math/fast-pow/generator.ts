import { Scene, BarObject, COLORS } from '@vsa/shared'

interface Params {
  base: number
  exp: number
}

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generator(params: Params): Generator<Scene, void, unknown> {
  const base = params.base
  let exp = params.exp
  let result = 1
  let cur = base

  const bits = exp.toString(2).split('').reverse()
  const bitCount = bits.length

  yield {
    objects: [
      mkBar('result', result, 0, COLORS.sorted, `result = ${result}`),
      mkBar('base', cur, 1, COLORS.default, `base = ${cur}`),
      mkBar('exp', exp, 2, COLORS.selected, `exp = ${exp}`),
      mkBar('bin', bitCount, 3, COLORS.pivot, `二进制 ${exp.toString(2)}`),
    ],
    highlights: [],
    codeLine: 1,
    description: `初始化：计算 ${base}^${exp}，指数二进制 = ${exp.toString(2)}`,
  }

  let step = 0
  while (exp > 0) {
    const bit = exp & 1
    const highlights: string[] = ['exp']
    if (bit === 1) {
      const prev = result
      result *= cur
      highlights.push('result')
      yield {
        objects: [
          mkBar('result', prev, 0, COLORS.comparing, `旧 result = ${prev}`),
          mkBar('base', cur, 1, COLORS.default, `base = ${cur}`),
          mkBar('exp', exp, 2, COLORS.selected, `exp = ${exp}`),
          mkBar('bit', bit, 3, COLORS.pivot, `当前位 = ${bit}`),
        ],
        highlights: highlights,
        codeLine: 4,
        description: `第 ${step + 1} 步：当前二进制位=${bit}（奇数），乘入结果：${prev} × ${cur} = ${result}`,
      }
      yield {
        objects: [
          mkBar('result', result, 0, COLORS.sorted, `result = ${result}`),
          mkBar('base', cur, 1, COLORS.default, `base = ${cur}`),
          mkBar('exp', exp, 2, COLORS.selected, `exp = ${exp}`),
          mkBar('bit', bit, 3, COLORS.pivot, `当前位 = ${bit}`),
        ],
        highlights: ['result', 'base'],
        codeLine: 5,
        description: `结果已更新：result = ${result}`,
      }
    } else {
      yield {
        objects: [
          mkBar('result', result, 0, COLORS.sorted, `result = ${result}`),
          mkBar('base', cur, 1, COLORS.default, `base = ${cur}`),
          mkBar('exp', exp, 2, COLORS.selected, `exp = ${exp}`),
          mkBar('bit', bit, 3, COLORS.pivot, `当前位 = ${bit}`),
        ],
        highlights: ['exp'],
        codeLine: 4,
        description: `第 ${step + 1} 步：当前二进制位=${bit}（偶数），跳过乘法`,
      }
    }

    const oldCur = cur
    cur *= cur
    exp >>= 1
    step++

    yield {
      objects: [
        mkBar('result', result, 0, COLORS.sorted, `result = ${result}`),
        mkBar('base', cur, 1, COLORS.comparing, `base² = ${oldCur}² = ${cur}`),
        mkBar('exp', exp, 2, COLORS.selected, `exp >>= 1 → ${exp}`),
        mkBar('bin', exp.toString(2).length, 3, COLORS.inactive, `二进制 ${exp.toString(2) || '0'}`),
      ],
      highlights: ['base', 'exp'],
      codeLine: 6,
      description: `底数平方：${oldCur}² = ${cur}，指数右移一位`,
    }
  }

  yield {
    objects: [
      mkBar('result', result, 0, COLORS.sorted, `结果 = ${result}`),
      mkBar('base', 0, 1, COLORS.inactive, '-'),
      mkBar('exp', 0, 2, COLORS.inactive, 'exp = 0'),
      mkBar('bin', 0, 3, COLORS.inactive, '-'),
    ],
    highlights: ['result'],
    codeLine: 7,
    description: `计算完成！${base}^${params.exp} = ${result}`,
  }
}
