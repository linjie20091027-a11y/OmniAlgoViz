import { useEffect, useMemo, useRef, useState, memo } from 'react'
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
    const update = () => setDims({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const w = dims.w
  const h = dims.h
  const n = bars.length
  const padding = 28

  if (n === 0 || w === 0) {
    return <div ref={containerRef} className="w-full h-full" />
  }

  const availW = w - padding * 2
  const availH = h - padding * 2 - 52
  const barGap = 3
  const totalGap = (n - 1) * barGap
  const barWidth = Math.min((availW - totalGap) / n, 56)
  const maxVal = Math.max(...bars.map(b => b.value), 1)
  const startX = (w - (barWidth * n + totalGap)) / 2

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      {bars.map((bar, i) => {
        const barH = Math.max((bar.value / maxVal) * availH, 3)
        const x = startX + i * (barWidth + barGap)
        const y = h - padding - barH - 40
        const hi = scene.highlights?.includes(bar.id)

        return (
          <div key={bar.id} className="absolute will-change-transform" style={{ left: x, top: y }}>
            <div
              className="absolute text-center font-mono transition-all duration-300 pointer-events-none select-none"
              style={{
                width: barWidth,
                bottom: barH + 4,
                fontSize: Math.max(10, Math.min(barWidth * 0.65, 12)),
                color: '#64748b',
                lineHeight: 1.1,
              }}
            >
              {bar.value}
            </div>

            <div
              className="rounded-t-md transition-all duration-300 ease-out"
              style={{
                width: barWidth,
                height: barH,
                background: bar.color,
                boxShadow: hi
                  ? '0 0 10px rgba(251,191,36,0.45), inset 0 0 0 2px rgba(251,191,36,0.7)'
                  : '0 1px 3px rgba(0,0,0,0.04)',
              }}
            />

            <div
              className="absolute text-center transition-all duration-300 pointer-events-none select-none"
              style={{
                width: barWidth,
                top: barH + 5,
                fontSize: 9,
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
