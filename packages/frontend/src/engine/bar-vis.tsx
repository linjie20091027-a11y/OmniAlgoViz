import { useRef, useEffect, useMemo } from 'react'
import type { Scene, BarObject } from '@vsa/shared'

interface Props {
  scene: Scene
}

export default function BarVisualizer({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const bars = useMemo(
    () => scene.objects.filter((o): o is BarObject => o.kind === 'bar'),
    [scene.objects]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement!
    const dpr = window.devicePixelRatio || 1
    canvas.width = parent.clientWidth * dpr
    canvas.height = parent.clientHeight * dpr
    canvas.style.width = parent.clientWidth + 'px'
    canvas.style.height = parent.clientHeight + 'px'

    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, parent.clientWidth, parent.clientHeight)

    const w = parent.clientWidth
    const h = parent.clientHeight
    const n = bars.length
    const padding = 32

    if (n === 0) return

    const availW = w - padding * 2
    const availH = h - padding * 2 - 40 // 底部留标签空间
    const barGap = 4
    const totalGap = (n - 1) * barGap
    const barWidth = Math.min((availW - totalGap) / n, 60)

    const maxVal = Math.max(...bars.map(b => b.value))
    const scaleY = availH / (maxVal || 1)

    const startX = (w - (barWidth * n + totalGap)) / 2

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i]
      const x = startX + i * (barWidth + barGap)
      const barH = Math.max(bar.value * scaleY, 4)
      const y = h - padding - barH - 40
      const radius = Math.min(barWidth / 2, 8)

      // 绘制柱子
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + barWidth - radius, y)
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius)
      ctx.lineTo(x + barWidth, y + barH)
      ctx.lineTo(x, y + barH)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.fillStyle = bar.color
      ctx.fill()

      // 高亮描边
      if (scene.highlights?.includes(bar.id)) {
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 2.5
        ctx.stroke()
      }

      // 数值标签
      ctx.fillStyle = '#64748b'
      ctx.font = `${Math.min(barWidth * 0.7, 12)}px 'JetBrains Mono', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(String(bar.value), x + barWidth / 2, y + barH + 6)

      // 索引标签
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText(String(i), x + barWidth / 2, h - 16)
    }
  }, [bars, scene.highlights])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  )
}
