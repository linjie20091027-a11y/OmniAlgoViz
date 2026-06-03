import { useRef, useEffect, useMemo } from 'react'
import type { Scene, PointObject } from '@vsa/shared'

interface Props { scene: Scene }

export default function PointVisualizer({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const points = useMemo(() => {
    return scene.objects.filter((o): o is PointObject => o.kind === 'point')
  }, [scene.objects])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement!
    const dpr = window.devicePixelRatio || 1
    const w = parent.clientWidth
    const h = parent.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    if (points.length === 0) return

    const padding = 40
    const xs = points.map(p => p.x)
    const ys = points.map(p => p.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs) || 1
    const minY = Math.min(...ys), maxY = Math.max(...ys) || 1
    const rangeX = maxX - minX || 1
    const rangeY = maxY - minY || 1

    const scaleX = (w - padding * 2) / rangeX
    const scaleY = (h - padding * 2 - 30) / rangeY
    const scale = Math.min(scaleX, scaleY)

    // 坐标轴
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, h - padding - 30)
    ctx.lineTo(w - padding, h - padding - 30)
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, h - padding - 30)
    ctx.stroke()

    for (const pt of points) {
      const sx = padding + (pt.x - minX) * scale
      const sy = h - padding - 30 - (pt.y - minY) * scale
      const r = pt.selected ? 7 : 5

      ctx.beginPath()
      ctx.arc(sx, sy, r, 0, Math.PI * 2)
      ctx.fillStyle = pt.color
      ctx.fill()

      if (scene.highlights?.includes(pt.id)) {
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 2.5
        ctx.stroke()
      }

      // 坐标标签
      ctx.fillStyle = '#64748b'
      ctx.font = '9px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`(${pt.x},${pt.y})`, sx, sy - r - 6)
    }
  }, [points, scene.highlights])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
