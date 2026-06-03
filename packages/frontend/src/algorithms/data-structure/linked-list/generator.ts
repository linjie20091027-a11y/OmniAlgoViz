import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

function buildBars(values: number[], headIdx: number, highlights: string[] = [], pointerIdx: number | null = null): BarObject[] {
  return values.map((v, i) => {
    let color = COLORS.default
    if (i === headIdx) color = COLORS.pointer
    if (highlights.includes(`node-${i}`)) color = COLORS.highlight
    if (pointerIdx === i) color = COLORS.comparing
    const next = i + 1 < values.length ? `→${i + 1}` : '→null'
    return mkBar(`node-${i}`, v, i, color, next)
  })
}

export default function* linkedListGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const values = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)
  let headIdx = 0

  yield {
    objects: buildBars(values, headIdx),
    highlights: [],
    codeLine: 1,
    description: `创建含 ${n} 个节点的单链表，头节点指向索引 0`,
  }

  for (let i = 0; i < n; i++) {
    headIdx = i
    yield {
      objects: buildBars(values, headIdx, [], i),
      highlights: [],
      codeLine: 3,
      description: `遍历到节点 ${i}，值为 ${values[i]}${i + 1 < n ? `，下一节点为节点 ${i + 1}` : '，这是尾节点'}`,
    }
  }

  const insertVal = Math.floor(Math.random() * 80) + 1
  const insertPos = Math.floor(n / 2)
  const newValues = [...values.slice(0, insertPos), insertVal, ...values.slice(insertPos)]

  yield {
    objects: buildBars(values, headIdx, [`node-${insertPos - 1}`], insertPos),
    highlights: [],
    codeLine: 5,
    description: `在位置 ${insertPos} 插入新节点 ${insertVal}`,
  }

  yield {
    objects: buildBars(newValues, 0, [`node-${insertPos}`]),
    highlights: [`node-${insertPos}`],
    codeLine: 6,
    description: `插入完成！新链表长度为 ${newValues.length}`,
  }

  const delPos = Math.floor(newValues.length / 3)
  yield {
    objects: buildBars(newValues, 0, [`node-${delPos}`]),
    highlights: [`node-${delPos}`],
    codeLine: 8,
    description: `删除位置 ${delPos} 的节点（值 = ${newValues[delPos]}）`,
  }

  const finalValues = [...newValues.slice(0, delPos), ...newValues.slice(delPos + 1)]
  yield {
    objects: buildBars(finalValues, 0),
    highlights: [],
    codeLine: 9,
    description: `删除完成！链表最终长度为 ${finalValues.length}`,
  }
}
