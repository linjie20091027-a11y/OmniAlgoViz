import type { Scene, PointObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkPoint(id: string, x: number, y: number, color: string, selected: boolean = false): PointObject {
  return { kind: 'point', id, x, y, color, selected }
}

function cross(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
}

function onSegment(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
  return Math.min(ax, bx) <= cx && cx <= Math.max(ax, bx) &&
    Math.min(ay, by) <= cy && cy <= Math.max(ay, by)
}

export default function* lineIntersection(_params: {}): Generator<Scene> {
  // 固定4个点构成2条线段
  const p1 = { id: 'p1', x: 150, y: 150 }
  const p2 = { id: 'p2', x: 400, y: 350 }
  const p3 = { id: 'p3', x: 300, y: 100 }
  const p4 = { id: 'p4', x: 200, y: 400 }

  const allPts = [p1, p2, p3, p4]

  yield {
    objects: [
      mkPoint(p1.id, p1.x, p1.y, COLORS.comparing, false),
      mkPoint(p2.id, p2.x, p2.y, COLORS.comparing, false),
      mkPoint(p3.id, p3.x, p3.y, COLORS.pointer, false),
      mkPoint(p4.id, p4.x, p4.y, COLORS.pointer, false),
    ],
    highlights: [],
    codeLine: 1,
    description: '线段AB (150,150)→(400,350) 和 线段CD (300,100)→(200,400)',
  }

  const d1 = cross(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y)
  const d2 = cross(p3.x, p3.y, p4.x, p4.y, p2.x, p2.y)
  const d3 = cross(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)
  const d4 = cross(p1.x, p1.y, p2.x, p2.y, p4.x, p4.y)

  yield {
    objects: [
      mkPoint(p1.id, p1.x, p1.y, d1 > 0 ? COLORS.pointer : COLORS.default, false),
      mkPoint(p2.id, p2.x, p2.y, d2 < 0 ? COLORS.pointer : COLORS.default, false),
      mkPoint(p3.id, p3.x, p3.y, COLORS.comparing, false),
      mkPoint(p4.id, p4.x, p4.y, COLORS.comparing, false),
    ],
    highlights: [],
    codeLine: 4,
    description: `叉积: cross(CD, A)=${d1}, cross(CD, B)=${d2}`,
  }

  yield {
    objects: [
      mkPoint(p1.id, p1.x, p1.y, COLORS.comparing, false),
      mkPoint(p2.id, p2.x, p2.y, COLORS.comparing, false),
      mkPoint(p3.id, p3.x, p3.y, d3 > 0 ? COLORS.pointer : COLORS.default, false),
      mkPoint(p4.id, p4.x, p4.y, d4 < 0 ? COLORS.pointer : COLORS.default, false),
    ],
    highlights: [],
    codeLine: 5,
    description: `叉积: cross(AB, C)=${d3}, cross(AB, D)=${d4}`,
  }

  const intersect = (d1 > 0 !== d2 > 0) && (d3 > 0 !== d4 > 0)

  yield {
    objects: allPts.map(p =>
      mkPoint(p.id, p.x, p.y, intersect ? COLORS.sorted : COLORS.swapping, true)
    ),
    highlights: [p1.id, p2.id, p3.id, p4.id],
    codeLine: 7,
    description: intersect ? '✓ 线段相交！(异侧判定通过)' : '✗ 线段不相交',
  }
}
