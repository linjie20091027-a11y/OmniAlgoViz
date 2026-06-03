import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

export default function* discretization(params: { size: number }): Generator<Scene> {
  const n = params.size
  const arr = Array.from(
    { length: n },
    () => Math.floor(Math.random() * 90) + 5,
  )

  yield {
    objects: arr.map((v, i) => mkBar(`bar-${i}`, v, i, COLORS.default)),
    highlights: [],
    codeLine: 1,
    description: '原始数组（值域很大，坐标压缩）',
  }

  const uniq = [...new Set(arr)].sort((a, b) => a - b)

  yield {
    objects: uniq.map((v, i) => mkBar(`uniq-${i}`, v, i, COLORS.sorted)),
    highlights: [],
    codeLine: 2,
    description: `排序去重（共 ${uniq.length} 个唯一元素）`,
  }

  const rank = new Map<number, number>()
  uniq.forEach((v, i) => rank.set(v, i))

  yield {
    objects: uniq.map((v, i) => {
      const r = rank.get(v)!
      return { kind: 'bar', id: `uniq-${i}`, value: r, index: i, color: COLORS.sorted, label: `${v}→${r}` }
    }),
    highlights: [],
    codeLine: 3,
    description: `值 → 排名映射（${uniq.length} 个键值对）`,
  }

  const compressed: number[] = []
  for (let i = 0; i < n; i++) {
    const r = rank.get(arr[i])!
    compressed.push(r)
    yield {
      objects: compressed.map((v, j) =>
        j === i
          ? mkBar(`comp-${j}`, v, j, COLORS.highlight)
          : mkBar(`comp-${j}`, v, j, COLORS.sorted),
      ),
      highlights: [`comp-${i}`],
      codeLine: 4,
      description: `arr[${i}] = ${arr[i]} → 排名 ${r}`,
    }
  }

  yield {
    objects: compressed.map((v, i) => mkBar(`comp-${i}`, v, i, COLORS.sorted)),
    highlights: [],
    codeLine: 4,
    description: `离散化完成！值域压缩至 [0, ${uniq.length - 1}]`,
  }
}
