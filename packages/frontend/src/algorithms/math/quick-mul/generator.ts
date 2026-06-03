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
  let result = 0

  yield {
    objects: [
      mkBar('a', a, 0, COLORS.default, `a = ${a}`),
      mkBar('b', b, 1, COLORS.default, `b = ${b}`),
      mkBar('result', result, 2, COLORS.sorted, `result = ${result}`),
    ],
    highlights: [],
    codeLine: 1,
    description: `俄罗斯农民乘法：计算 ${a} × ${b}，只用加法实现`,
  }

  let step = 0
  while (b > 0) {
    const highlight: string[] = []
    if (b & 1) {
      const prev = result
      result += a
      highlight.push('a', 'result')
      yield {
        objects: [
          mkBar('a', a, 0, COLORS.comparing, `a = ${a}`),
          mkBar('b', b, 1, COLORS.selected, `b = ${b}`),
          mkBar('result', prev, 2, COLORS.comparing, `旧 result = ${prev}`),
        ],
        highlights: highlight,
        codeLine: 4,
        description: `第 ${++step} 步：b=${b} 为奇数，累加：result = ${prev} + ${a} = ${result}`,
      }
    } else {
      yield {
        objects: [
          mkBar('a', a, 0, COLORS.default, `a = ${a}`),
          mkBar('b', b, 1, COLORS.selected, `b = ${b}`),
          mkBar('result', result, 2, COLORS.sorted, `result = ${result}`),
        ],
        highlights: ['b'],
        codeLine: 4,
        description: `第 ${++step} 步：b=${b} 为偶数，跳过累加`,
      }
    }

    a <<= 1
    b >>= 1

    if (b > 0) {
      yield {
        objects: [
          mkBar('a', a, 0, COLORS.comparing, `a <<= 1 → ${a}`),
          mkBar('b', b, 1, COLORS.comparing, `b >>= 1 → ${b}`),
          mkBar('result', result, 2, COLORS.sorted, `result = ${result}`),
        ],
        highlights: ['a', 'b'],
        codeLine: 5,
        description: `a 翻倍 = ${a}，b 减半 = ${b}`,
      }
    }
  }

  yield {
    objects: [
      mkBar('ans', result, 0, COLORS.sorted, `结果 = ${result}`),
      mkBar('verify', params.a * params.b, 1, COLORS.sorted, `验证 = ${params.a * params.b}`),
      mkBar('a', 0, 2, COLORS.inactive, '-'),
    ],
    highlights: ['ans', 'verify'],
    codeLine: 6,
    description: `计算完成！${params.a} × ${params.b} = ${result}`,
  }
}
