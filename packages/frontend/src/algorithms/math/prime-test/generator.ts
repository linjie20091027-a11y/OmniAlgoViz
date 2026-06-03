import { Scene, BarObject, COLORS } from '@vsa/shared'

interface Params {
  n: number
  size: number
}

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function modPow(a: number, b: number, m: number): number {
  let r = 1
  let base = a % m
  while (b > 0) {
    if (b & 1) r = (r * base) % m
    base = (base * base) % m
    b >>= 1
  }
  return r
}

export default function* generator(params: Params): Generator<Scene, void, unknown> {
  const n = params.n
  const k = params.size

  function* checkWitness(a: number, d: number, s: number): Generator<Scene, void, unknown> {
    let x = 1
    let base = a % n
    let exp = d

    yield {
      objects: [
        mkBar('witness', a, 0, COLORS.selected, `底数 a = ${a}`),
        mkBar('d', d, 1, COLORS.pivot, `d = ${d}`),
        mkBar('s', s, 2, COLORS.default, `s = ${s}`),
        mkBar('x', x, 3, COLORS.default, `x = ${x}`),
      ],
      highlights: ['witness'],
      codeLine: 5,
      description: `测试底数 a = ${a}，n-1 = ${n - 1} = ${d} × 2^${s}`,
    }

    x = modPow(a, d, n)
    yield {
      objects: [
        mkBar('x_0', x, 0, COLORS.comparing, `a^d mod n = ${x}`),
        mkBar('d', d, 1, COLORS.pivot, `d = ${d}`),
        mkBar('s', s, 2, COLORS.default, `s = ${s}`),
        mkBar('n1', n - 1, 3, COLORS.inactive, `n-1 = ${n - 1}`),
      ],
      highlights: ['x_0'],
      codeLine: 6,
      description: `计算 x = ${a}^${d} mod ${n} = ${x}`,
    }

    if (x === 1 || x === n - 1) {
      yield {
        objects: [
          mkBar('x', x, 0, COLORS.sorted, `x = ${x}`),
          mkBar('pass', 1, 1, COLORS.sorted, '通过'),
          mkBar('info', 0, 2, COLORS.inactive, '-'),
          mkBar('info2', 0, 3, COLORS.inactive, '-'),
        ],
        highlights: ['x', 'pass'],
        codeLine: 7,
        description: `x = ${x}，等于 1 或 n-1，通过本轮测试`,
      }
      return
    }

    for (let i = 0; i < s - 1; i++) {
      const prev = x
      x = (x * x) % n
      yield {
        objects: [
          mkBar('x_old', prev, 0, COLORS.comparing, `前值 = ${prev}`),
          mkBar('x_new', x, 1, COLORS.pivot, `x² mod n = ${x}`),
          mkBar('round', i + 1, 2, COLORS.selected, `第 ${i + 1} 次平方`),
          mkBar('target', n - 1, 3, COLORS.inactive, `n-1 = ${n - 1}`),
        ],
        highlights: ['x_new'],
        codeLine: 10,
        description: `第 ${i + 1} 次平方：${prev}² mod ${n} = ${x}`,
      }

      if (x === n - 1) {
        yield {
          objects: [
            mkBar('x', x, 0, COLORS.sorted, `x = n-1 = ${x}`),
            mkBar('pass', 1, 1, COLORS.sorted, '通过'),
            mkBar('round', i + 1, 2, COLORS.inactive, '-'),
            mkBar('info', 0, 3, COLORS.inactive, '-'),
          ],
          highlights: ['x', 'pass'],
          codeLine: 11,
          description: `x = n - 1，通过测试`,
        }
        return
      }
    }

    yield {
      objects: [
        mkBar('x', x, 0, COLORS.comparing, `最终 x = ${x}`),
        mkBar('fail', 0, 1, COLORS.swapping, '合数！'),
        mkBar('n', n, 2, COLORS.inactive, `n = ${n}`),
        mkBar('info', 0, 3, COLORS.inactive, '-'),
      ],
      highlights: ['fail'],
      codeLine: 12,
      description: `${a} 证明 ${n} 是合数！（底数 ${a} 是见证者）`,
    }
  }

  yield {
    objects: [
      mkBar('n', n, 0, COLORS.default, `n = ${n}`),
      mkBar('k', k, 1, COLORS.pivot, `测试轮数 = ${k}`),
    ],
    highlights: ['n'],
    codeLine: 1,
    description: `Miller-Rabin 素性测试：检测 ${n} 是否为素数，共 ${k} 轮`,
  }

  if (n < 2) {
    yield {
      objects: [mkBar('not', 0, 0, COLORS.swapping, 'n < 2，不是素数')],
      highlights: ['not'],
      codeLine: 2,
      description: `${n} < 2，不是素数`,
    }
    return
  }
  if (n === 2) {
    yield {
      objects: [mkBar('yes', 1, 0, COLORS.sorted, '2 是素数')],
      highlights: ['yes'],
      codeLine: 2,
      description: '2 是素数',
    }
    return
  }
  if (n % 2 === 0) {
    yield {
      objects: [mkBar('even', 0, 0, COLORS.swapping, `${n} 是偶数，不是素数`)],
      highlights: ['even'],
      codeLine: 3,
      description: `${n} 是偶数，不是素数`,
    }
    return
  }

  let d = n - 1
  let s = 0
  while (d % 2 === 0) {
    d /= 2
    s++
  }

  yield {
    objects: [
      mkBar('n1', n - 1, 0, COLORS.default, `n-1 = ${n - 1}`),
      mkBar('d', d, 1, COLORS.pivot, `d = ${d}`),
      mkBar('s', s, 2, COLORS.selected, `s = ${s}`),
    ],
    highlights: ['d', 's'],
    codeLine: 4,
    description: `分解 n-1 = d × 2^s = ${d} × 2^${s}`,
  }

  const witnesses = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37].filter((w) => w < n).slice(0, k)

  for (const a of witnesses) {
    yield* checkWitness(a, d, s)
  }

  yield {
    objects: [
      mkBar('ans', n, 0, COLORS.sorted, `${n} 很可能是素数`),
      mkBar('tested', k, 1, COLORS.sorted, `已测试 ${k} 轮`),
      mkBar('info', 1, 2, COLORS.sorted, '通过全部测试'),
    ],
    highlights: ['ans', 'tested', 'info'],
    codeLine: 14,
    description: `${n} 通过了所有 ${k} 轮 Miller-Rabin 测试，极大概率为素数`,
  }
}
