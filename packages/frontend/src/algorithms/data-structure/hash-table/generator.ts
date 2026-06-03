import type { Scene, ListNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* hashTableGenerator(params: { size: number }): Generator<Scene> {
  const m = params.size
  const buckets: { id: string; value: number; prev: string | null; next: string | null }[][] =
    Array.from({ length: m }, (_, i) => [{
      id: `head-${i}`, value: -1, prev: null, next: null,
    }])

  function buildChainObjects(): ListNodeObject[] {
    const result: ListNodeObject[] = []
    for (let i = 0; i < m; i++) {
      const chain = buckets[i]
      const listNodes = chain.map((nd, j) => ({
        kind: 'listNode' as const,
        id: nd.id,
        value: nd.value === -1 ? 0 : nd.value,
        prevId: j > 0 ? chain[j - 1].id : null,
        nextId: j < chain.length - 1 ? chain[j + 1].id : null,
        color: nd.value === -1 ? COLORS.inactive : COLORS.default,
        head: j === 0,
      }))
      result.push(...listNodes)
    }
    return result
  }

  yield {
    objects: buildChainObjects(),
    highlights: [],
    codeLine: 1,
    description: `初始化哈希表，${m} 个桶，使用链地址法`,
  }

  const keys = [14, 21, 7, 35, 10, 42, 28, 5].slice(0, Math.min(8, m * 2))
  for (const key of keys) {
    const bucket = ((key % m) + m) % m
    const id = `node-${key}`
    const chain = buckets[bucket]
    const tail = chain[chain.length - 1]
    tail.next = id
    chain.push({ id, value: key, prev: tail.id, next: null })

    yield {
      objects: buildChainObjects().map(o =>
        o.id === id ? { ...o, color: COLORS.sorted } : o
      ),
      highlights: [id, `head-${bucket}`],
      codeLine: 4,
      description: `insert(${key}) → hash=${bucket}，链入桶 ${bucket}`,
    }
  }

  yield {
    objects: buildChainObjects(),
    highlights: [],
    codeLine: 7,
    description: `所有元素插入完成`,
  }
}
