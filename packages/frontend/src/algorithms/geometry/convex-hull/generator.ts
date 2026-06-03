import type { Scene, PointObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkPoint(id: string, x: number, y: number, color: string, selected: boolean = false): PointObject {
  return { kind: 'point', id, x, y, color, selected }
}

function* andrewConvexHull(params: { size: number }): Generator<Scene> {
  const n = params.size
  const points: { id: string; x: number; y: number }[] = []
  for (let i = 0; i < n; i++) {
    points.push({
      id: `p-${i}`,
      x: 50 + Math.random() * 700,
      y: 50 + Math.random() * 400,
    })
  }

  const pointObjs = (hullSet: Set<number>, cur: number, upper: boolean) =>
    points.map((p, i) => {
      let color = COLORS.default
      if (hullSet.has(i)) color = COLORS.sorted
      if (i === cur) color = COLORS.comparing
      return mkPoint(p.id, p.x, p.y, color, hullSet.has(i))
    })

  yield { objects: pointObjs(new Set(), -1, false), highlights: [], codeLine: 1, description: `${n} 个随机点，准备计算凸包` }

  // 按 x 排序，x 相同按 y
  const sorted = points.map((p, i) => ({ ...p, origIdx: i })).sort((a, b) => a.x - b.x || a.y - b.y)

  yield {
    objects: sorted.map((p, i) => mkPoint(`s-${i}`, p.x, p.y, COLORS.default, false)),
    highlights: [],
    codeLine: 3,
    description: '按 x 坐标排序',
  }

  const cross = (o: typeof sorted[0], a: typeof sorted[0], b: typeof sorted[0]) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)

  const hull: number[] = []
  const used = new Set<number>()

  // 下凸壳
  for (let i = 0; i < sorted.length; i++) {
    while (hull.length >= 2 && cross(sorted[hull[hull.length - 2]], sorted[hull[hull.length - 1]], sorted[i]) <= 0) {
      const popped = hull.pop()!
      used.delete(sorted[popped].origIdx)
    }
    hull.push(i)

    yield {
      objects: points.map((p, pi) => {
        let color = COLORS.default
        if (pi === sorted[i].origIdx) color = COLORS.comparing
        if (used.has(pi)) color = COLORS.pointer
        return mkPoint(p.id, p.x, p.y, color, false)
      }),
      highlights: [sorted[i].id],
      codeLine: 7,
      description: `下凸壳: 处理点 (${sorted[i].x.toFixed(0)}, ${sorted[i].y.toFixed(0)})`,
    }
  }

  // 上凸壳
  const lowerSize = hull.length
  for (let i = sorted.length - 2; i >= 0; i--) {
    while (hull.length > lowerSize && cross(sorted[hull[hull.length - 2]], sorted[hull[hull.length - 1]], sorted[i]) <= 0) {
      const popped = hull.pop()!
      used.delete(sorted[popped].origIdx)
    }
    hull.push(i)

    yield {
      objects: points.map((p, pi) => {
        let color = COLORS.default
        if (pi === sorted[i].origIdx) color = COLORS.comparing
        for (const h of hull) used.add(sorted[h].origIdx)
        if (used.has(pi)) color = COLORS.pointer
        return mkPoint(p.id, p.x, p.y, color, false)
      }),
      highlights: [],
      codeLine: 12,
      description: `上凸壳: 处理点 (${sorted[i].x.toFixed(0)}, ${sorted[i].y.toFixed(0)})`,
    }
  }

  hull.pop() // 移除重复终点

  const hullSet = new Set<number>()
  for (const h of hull) hullSet.add(sorted[h].origIdx)

  yield {
    objects: pointObjs(hullSet, -1, false),
    highlights: [...hullSet].map(i => `p-${i}`),
    codeLine: 17,
    description: `凸包完成！共 ${hullSet.size} 个顶点`,
  }
}

export default andrewConvexHull
