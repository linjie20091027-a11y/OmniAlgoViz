import type { Scene, PointObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkPoint(id: string, x: number, y: number, color: string, selected: boolean = false): PointObject {
  return { kind: 'point', id, x, y, color, selected }
}

export default function* pointInPolygon(params: { size: number }): Generator<Scene> {
  const K = params.size
  // 生成多边形顶点
  const cx = 400, cy = 220, rx = 250, ry = 150
  const poly: { id: string; x: number; y: number }[] = []
  for (let i = 0; i < K; i++) {
    const angle = (2 * Math.PI * i) / K - Math.PI / 2
    poly.push({
      id: `v-${i}`,
      x: cx + rx * Math.cos(angle) + Math.random() * 30 - 15,
      y: cy + ry * Math.sin(angle) + Math.random() * 30 - 15,
    })
  }

  // 测试点
  const tp1 = { id: 't-in', x: cx, y: cy }
  const tp2 = { id: 't-out', x: 100, y: 120 }
  const testPoints = [tp1, tp2]

  yield {
    objects: [
      ...poly.map(p => mkPoint(p.id, p.x, p.y, COLORS.default, false)),
      ...testPoints.map(t => mkPoint(t.id, t.x, t.y, COLORS.comparing, true)),
    ],
    highlights: [],
    codeLine: 1,
    description: `多边形(${K}条边) 与 2个测试点`,
  }

  for (const tp of testPoints) {
    yield {
      objects: [
        ...poly.map(p => mkPoint(p.id, p.x, p.y, COLORS.default, false)),
        mkPoint(tp.id, tp.x, tp.y, COLORS.comparing, true),
      ],
      highlights: [tp.id],
      codeLine: 4,
      description: `射线法测试: 点 (${tp.x.toFixed(0)}, ${tp.y.toFixed(0)})`,
    }

    let inside = false
    for (let i = 0, j = K - 1; i < K; j = i++) {
      const xi = poly[i].x, yi = poly[i].y
      const xj = poly[j].x, yj = poly[j].y

      const intersect = ((yi > tp.y) !== (yj > tp.y)) &&
        (tp.x < (xj - xi) * (tp.y - yi) / (yj - yi) + xi)

      yield {
        objects: [
          mkPoint(poly[i].id, xi, yi, intersect ? COLORS.comparing : COLORS.default, false),
          mkPoint(poly[j].id, xj, yj, intersect ? COLORS.comparing : COLORS.default, false),
          ...poly.filter(p => p.id !== poly[i].id && p.id !== poly[j].id)
            .map(p => mkPoint(p.id, p.x, p.y, COLORS.inactive, false)),
          mkPoint(tp.id, tp.x, tp.y, COLORS.highlight, true),
        ],
        highlights: [tp.id, poly[i].id, poly[j].id],
        codeLine: 7,
        description: `检查边(${i},${j})，射线${intersect ? '相交' : '不相交'}，当前inside=${inside ? '是' : '否'}`,
      }

      if (intersect) inside = !inside
    }

    yield {
      objects: [
        ...poly.map(p => mkPoint(p.id, p.x, p.y, inside ? COLORS.pointer : COLORS.inactive, false)),
        mkPoint(tp.id, tp.x, tp.y, inside ? COLORS.sorted : COLORS.swapping, true),
      ],
      highlights: [tp.id],
      codeLine: 13,
      description: `${tp.id === 't-in' ? '内部点' : '外部点'}: ${inside ? '在多边形内' : '在多边形外'}`,
    }
  }
}
