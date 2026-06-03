import { useMemo, useRef, useEffect, useState } from 'react'
import type { Scene, BarObject } from '@vsa/shared'

interface Props { scene: Scene }

export default function BarVisualizer({ scene }: Props) {
  const bars = useMemo(
    () => scene.objects.filter((o): o is BarObject => o.kind === 'bar'),
    [scene.objects]
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      setDims({ w: e.contentRect.width, h: e.contentRect.height })
    })
    ro.observe(el)
    setDims({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  const w = dims.w
  const h = dims.h
  const n = bars.length
  const padding = 32

  if (n === 0 || w === 0) {
    return <div ref={containerRef} className="w-full h-full" />
  }

  const availW = w - padding * 2
  const availH = h - padding * 2 - 50
  const barGap = 4
  const totalGap = (n - 1) * barGap
  const barWidth = Math.min((availW - totalGap) / n, 60)
  const maxVal = Math.max(...bars.map(b => b.value), 1)
  const startX = (w - (barWidth * n + totalGap)) / 2

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      {bars.map((bar, i) => {
        const barHeight = Math.max((bar.value / maxVal) * availH, 4)
        const x = startX + i * (barWidth + barGap)
        const y = h - padding - barHeight - 40
        const isHighlight = scene.highlights?.includes(bar.id)

        return (
          <div key={bar.id} className="absolute" style={{ left: x, top: y }}>
            {/* 数值标签 */}
            <div
              className="absolute text-center font-mono transition-all duration-300"
              style={{
                width: barWidth,
                bottom: barHeight + 4,
                fontSize: Math.min(barWidth * 0.7, 12),
                color: '#64748b',
                lineHeight: 1,
              }}
            >
              {bar.value}
            </div>

            {/* 柱子 */}
            <div
              className="rounded-t-lg transition-all duration-300 ease-out"
              style={{
                width: barWidth,
                height: barHeight,
                background: bar.color,
                boxShadow: isHighlight
                  ? '0 0 12px rgba(251, 191, 36, 0.5), inset 0 0 0 2px rgba(251, 191, 36, 0.8)'
                  : '0 2px 4px rgba(0,0,0,0.06)',
              }}
            />

            {/* 索引标签 */}
            <div
              className="absolute text-center transition-all duration-300"
              style={{
                width: barWidth,
                top: barHeight + 6,
                fontSize: 10,
                color: '#94a3b8',
                lineHeight: 1,
              }}
            >
              {i}
            </div>
          </div>
        )
      })}
    </div>
  )
}
