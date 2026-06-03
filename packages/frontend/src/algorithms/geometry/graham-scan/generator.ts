import type { Scene, PointObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkPoint(id: string, x: number, y: number, color: string, selected: boolean = false): PointObject {
  return { kind: 'point', id, x, y, color, selected }
}

function cross(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
}

export default function* grahamScan(params: { size: number }): Generator<Scene> {
  const n = params.size
  const pts: { id: string; x: number; y: number }[] = []
  for (let i = 0; i < n; i++) {
    pts.push({ id: `p-${i}`, x: 50 + Math.random() * 700, y: 50 + Math.random() * 400 })
  }

  yield {
    objects: pts.map(p => mkPoint(p.id, p.x, p.y, COLORS.default, false)),
    highlights: [],
    codeLine: 1,
    description: `${n} 个随机点`,
  }

  // 找最低最左点作为极点
  let pivotIdx = 0
  for (let i = 1; i < n; i++) {
    if (pts[i].y < pts[pts.length === n ? pivotIdx : pivotIdx].y ||
      (pts[i].y === pts[pivotIdx].y && pts[i].x < pts[pivotIdx].x)) {
      pivotIdx = i
    }
  }
  const pivot = pts[pivotIdx]

  yield {
    objects: pts.map(p =>
      mkPoint(p.id, p.x, p.y, p.id === pivot.id ? COLORS.highlight : COLORS.default, p.id === pivot.id)
    ),
    highlights: [pivot.id],
    codeLine: 4,
    description: `极点: (${pivot.x.toFixed(0)}, ${pivot.y.toFixed(0)})，最下最左`,
  }

  // 按极角排序
  const sorted = pts
    .filter(p => p.id !== pivot.id)
    .sort((a, b) => {
      const c = cross(pivot.x, pivot.y, a.x, a.y, b.x, b.y)
      if (c !== 0) return -c
      // 距离越近越前
      return (Math.hypot(a.x - pivot.x, a.y - pivot.y) - Math.hypot(b.x - pivot.x, b.y - pivot.y))
    })

  yield {
    objects: [
      mkPoint(pivot.id, pivot.x, pivot.y, COLORS.highlight, true),
      ...sorted.map((p, i) =>
        mkPoint(p.id, p.x, p.y, i < 3 ? COLORS.comparing : COLORS.default, false)
      ),
    ],
    highlights: [],
    codeLine: 7,
    description: '按极角排序完成，从极点出发逆时针',
  }

  const stack = [pivot, sorted[0], sorted[1]]

  yield {
    objects: [
      ...pts.map(p => {
        const inStack = stack.some(s => s.id === p.id)
        return mkPoint(p.id, p.x, p.y, inStack ? COLORS.sorted : COLORS.default, inStack)
      }),
    ],
    highlights: stack.map(s => s.id),
    codeLine: 10,
    description: `栈初始: ${stack.map(s => s.id).join(' → ')}`,
  }

  for (let i = 2; i < sorted.length; i++) {
    while (stack.length >= 2) {
      const top = stack[stack.length - 1]
      const nextTop = stack[stack.length - 2]
      if (cross(nextTop.x, nextTop.y, top.x, top.y, sorted[i].x, sorted[i].y) > 0) break

      const popped = stack.pop()!
      yield {
        objects: [
          ...pts.map(p => {
            const inStack = stack.some(s => s.id === p.id)
            let color = COLORS.default
            if (p.id === popped.id) color = COLORS.swapping
            else if (inStack) color = COLORS.sorted
            return mkPoint(p.id, p.x, p.y, color, inStack && p.id !== popped.id)
          }),
        ],
        highlights: [sorted[i].id],
        codeLine: 14,
        description: `右转！弹出 ${popped.id}`,
      }
    }
    stack.push(sorted[i])

    yield {
      objects: [
        ...pts.map(p => {
          const inStack = stack.some(s => s.id === p.id)
          return mkPoint(p.id, p.x, p.y, inStack ? COLORS.sorted : COLORS.default, inStack)
        }),
      ],
      highlights: [sorted[i].id],
      codeLine: 16,
      description: `加入 ${sorted[i].id}，栈大小=${stack.length}`,
    }
  }

  const hullIds = new Set(stack.map(s => s.id))
  yield {
    objects: pts.map(p =>
      mkPoint(p.id, p.x, p.y, hullIds.has(p.id) ? COLORS.sorted : COLORS.inactive, hullIds.has(p.id))
    ),
    highlights: stack.map(s => s.id),
    codeLine: 20,
    description: `Graham Scan完成！凸包共 ${stack.length} 个顶点`,
  }
}
