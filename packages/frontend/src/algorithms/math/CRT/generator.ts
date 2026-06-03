import { Scene, BarObject, COLORS } from '@vsa/shared'

interface Params {
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

function extendedGcd(a: number, b: number): [number, number, number] {
  if (b === 0) return [a, 1, 0]
  const [d, x1, y1] = extendedGcd(b, a % b)
  return [d, y1, x1 - Math.floor(a / b) * y1]
}

function modInv(a: number, m: number): number {
  const [d, x] = extendedGcd(a, m)
  return ((x % m) + m) % m
}

export default function* generator(params: Params): Generator<Scene, void, unknown> {
  const n = params.size

  const remainders = [2, 3, 2]
  const moduli = [3, 5, 7]

  const r: number[] = []
  const m: number[] = []
  for (let i = 0; i < n; i++) {
    r.push(remainders[i % 3])
    m.push(moduli[i % 3] + i)
  }

  yield {
    objects: r.map((v, i) => mkBar(`r${i}`, v, i, COLORS.default, `余数=${v}`)),
    highlights: [],
    codeLine: 1,
    description: `同余方程组：x ≡ ${r.join(', ')} (mod ${m.join(', ')})`,
  }

  yield {
    objects: m.map((v, i) => mkBar(`m${i}`, v, i, COLORS.selected, `模=${v}`)),
    highlights: [],
    codeLine: 2,
    description: `各个模数：${m.join(', ')}`,
  }

  let M = 1
  for (let i = 0; i < n; i++) M *= m[i]

  yield {
    objects: [mkBar('M', M, 0, COLORS.pivot, `M = ${M}`)],
    highlights: ['M'],
    codeLine: 3,
    description: `计算总模数 M = ∏ m_i = ${M}`,
  }

  const Mi: number[] = []
  for (let i = 0; i < n; i++) {
    Mi.push(M / m[i])
  }

  yield {
    objects: Mi.map((v, i) => mkBar(`Mi${i}`, v, i, COLORS.default, `M_${i}=${v}`)),
    highlights: [],
    codeLine: 4,
    description: `计算各 M_i = M / m_i = ${Mi.join(', ')}`,
  }

  const inv: number[] = []
  for (let i = 0; i < n; i++) {
    const invi = modInv(Mi[i], m[i])
    inv.push(invi)
    yield {
      objects: [
        mkBar(`Mi${i}`, Mi[i], 0, COLORS.default, `M_${i} = ${Mi[i]}`),
        mkBar(`mod${i}`, m[i], 1, COLORS.selected, `m_${i} = ${m[i]}`),
        mkBar(`inv${i}`, invi, 2, COLORS.pivot, `逆元 = ${invi}`),
      ],
      highlights: [`Mi${i}`, `inv${i}`],
      codeLine: 5,
      description: `求 M_${i} 在模 m_${i} 下的逆元：${Mi[i]} × ${invi} ≡ 1 (mod ${m[i]})`,
    }
  }

  let x = 0
  for (let i = 0; i < n; i++) {
    x = (x + r[i] * Mi[i] * inv[i]) % M
  }

  yield {
    objects: inv.map((v, i) =>
      mkBar(`t${i}`, r[i] * Mi[i] * v, i, COLORS.comparing, `项=${r[i]}×${Mi[i]}×${v}`)
    ),
    highlights: [],
    codeLine: 6,
    description: `计算各项贡献：r_i × M_i × inv_i，求和得 x = ${x}`,
  }

  yield {
    objects: [
      mkBar('ans', x, 0, COLORS.sorted, `解 x = ${x}`),
      ...r.map((v, i) => mkBar(`chk${i}`, x % m[i], i + 1, COLORS.sorted, `${x} mod ${m[i]} = ${x % m[i]}`)),
    ],
    highlights: ['ans'],
    codeLine: 7,
    description: `最终解：x = ${x}，验证：${r.map((ri, i) => `${x} mod ${m[i]} = ${ri}`).join('，')}`,
  }
}
