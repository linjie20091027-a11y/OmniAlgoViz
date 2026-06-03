import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function hashFunc(key: number, m: number): number {
  return ((key % m) + m) % m
}

export default function* hashTableGenerator(params: { size: number }): Generator<Scene> {
  const m = params.size
  const table: number[][] = Array.from({ length: m }, () => [])

  yield {
    objects: table.map((_, i) => mkBar(`bucket-${i}`, 0, i, COLORS.default, `桶 ${i}: 空`)),
    highlights: [],
    codeLine: 1,
    description: `初始化哈希表，共 ${m} 个桶，使用除留余数法 hash(key) = key % ${m}`,
  }

  const keys = [14, 21, 7, 35, 10, 42, 28, 5].slice(0, Math.min(8, m * 2 - 1))

  for (const key of keys) {
    const bucket = hashFunc(key, m)
    table[bucket].push(key)

    const bars = table.map((chain, i) => {
      const totalVal = chain.length > 0 ? chain[0] : 0
      let color = COLORS.default
      if (i === bucket) color = COLORS.highlight
      if (chain.length === 0) color = COLORS.inactive
      const label = chain.length > 0 ? `桶 ${i}: [${chain.join(', ')}]` : `桶 ${i}: 空`
      return mkBar(`bucket-${i}`, chain.length * 10, i, color, label)
    })

    yield {
      objects: bars,
      highlights: [`bucket-${bucket}`],
      codeLine: 4,
      description: `insert(${key}) → hash = ${key} % ${m} = ${bucket}，加入桶 ${bucket}`,
    }
  }

  yield {
    objects: table.map((chain, i) => {
      const label = chain.length > 0 ? `桶 ${i}: [${chain.join(', ')}]` : `桶 ${i}: 空`
      return mkBar(`bucket-${i}`, chain.length * 10, i, COLORS.sorted, label)
    }),
    highlights: [],
    codeLine: 5,
    description: '所有元素插入完成，展示各桶链表',
  }
}
