import { Scene, BarObject, COLORS } from '@vsa/shared'

interface Params {
  size: number
}

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

export default function* generator(params: Params): Generator<Scene, void, unknown> {
  const n = params.size
  const pascal: number[][] = Array.from({ length: n }, () => [])

  for (let i = 0; i < n; i++) {
    pascal[i][0] = 1
    pascal[i][i] = 1
  }

  yield {
    objects: [mkBar('c0_0', 1, 0, COLORS.default, 'C(0,0)=1')],
    highlights: [],
    codeLine: 1,
    description: `杨辉三角初始化：第 0 行 C(0,0) = 1`,
  }

  for (let row = 1; row < n; row++) {
    const rowStart = ((row - 1) * row) / 2 + 1

    yield {
      objects: [mkBar('rowTitle', row, 0, COLORS.pivot, `第 ${row} 行`)],
      highlights: ['rowTitle'],
      codeLine: 3,
      description: `开始计算杨辉三角第 ${row} 行（C(${row}, k) 组合数）`,
    }

    yield {
      objects: [
        mkBar('left', 1, 0, COLORS.sorted, `C(${row},0)=1`),
        mkBar('info', 0, 1, COLORS.inactive, '-'),
        mkBar('right', 1, 2, COLORS.sorted, `C(${row},${row})=1`),
      ],
      highlights: ['left', 'right'],
      codeLine: 4,
      description: `边界值：C(${row},0) = C(${row},${row}) = 1`,
    }

    for (let col = 1; col < row; col++) {
      pascal[row][col] = pascal[row - 1][col - 1] + pascal[row - 1][col]

      const totalBefore = (row * (row + 1)) / 2
      const prevRowBefore = ((row - 1) * row) / 2

      const bars: BarObject[] = []
      for (let k = 0; k <= row; k++) {
        const val = k === 0 ? 1 : k === row ? 1 : pascal[row][k] || 0
        const id = `c${row}_${k}`
        const color =
          k === col
            ? COLORS.sorted
            : k < col && k > 0
              ? COLORS.default
              : COLORS.inactive
        bars.push(mkBar(id, val, k, color, `C(${row},${k})=${val}`))
      }

      yield {
        objects: bars,
        highlights: [`c${row - 1}_${col - 1}`, `c${row - 1}_${col}`, `c${row}_${col}`],
        codeLine: 5,
        description: `C(${row},${col}) = C(${row - 1},${col - 1}) + C(${row - 1},${col}) = ${pascal[row - 1][col - 1]} + ${pascal[row - 1][col]} = ${pascal[row][col]}`,
      }
    }

    const finalBars: BarObject[] = []
    for (let k = 0; k <= row; k++) {
      finalBars.push(
        mkBar(`c${row}_${k}`, pascal[row][k], k, COLORS.sorted, `C(${row},${k})=${pascal[row][k]}`)
      )
    }
    yield {
      objects: finalBars,
      highlights: finalBars.map((b) => b.id),
      codeLine: 6,
      description: `第 ${row} 行完成：${pascal[row].join(', ')}`,
    }
  }

  const allBars: BarObject[] = []
  let idx = 0
  for (let i = 0; i < n; i++) {
    for (let k = 0; k <= i; k++) {
      allBars.push(
        mkBar(`c${i}_${k}`, pascal[i][k], idx++, COLORS.sorted, `C(${i},${k})`)
      )
    }
  }

  yield {
    objects: allBars,
    highlights: allBars.map((b) => b.id),
    codeLine: 7,
    description: `杨辉三角（组合数表）全部完成！共 ${n} 行`,
  }
}
