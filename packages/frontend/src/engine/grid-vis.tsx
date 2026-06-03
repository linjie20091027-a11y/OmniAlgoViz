import { useRef, useEffect, useMemo } from 'react'
import type { Scene, CellObject } from '@vsa/shared'

interface Props { scene: Scene }

export default function GridVisualizer({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const cells = useMemo(() => {
    const cs = scene.objects.filter((o): o is CellObject => o.kind === 'cell')
    return cs
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

    if (cells.length === 0) return

    const maxRow = Math.max(...cells.map(c => c.row)) + 1
    const maxCol = Math.max(...cells.map(c => c.col)) + 1

    const padding = 40
    const cellW = Math.min(80, (w - padding * 2) / maxCol)
    const cellH = Math.min(44, (h - padding * 2) / maxRow)
    const startX = (w - cellW * maxCol) / 2
    const startY = (h - cellH * maxRow) / 2

    const cellMap = new Map<string, CellObject>()
    for (const c of cells) cellMap.set(`${c.row}-${c.col}`, c)

    for (let r = 0; r < maxRow; r++) {
      for (let c = 0; c < maxCol; c++) {
        const cell = cellMap.get(`${r}-${c}`)
        const x = startX + c * cellW
        const y = startY + r * cellH
        const isHighlight = cell ? scene.highlights.includes(cell.id) : false

        ctx.fillStyle = cell ? cell.color : '#f8fafc'
        ctx.fillRect(x, y, cellW, cellH)
        ctx.strokeStyle = isHighlight ? '#fbbf24' : '#e2e8f0'
        ctx.lineWidth = isHighlight ? 2 : 0.5
        ctx.strokeRect(x, y, cellW, cellH)

        if (isHighlight) {
          ctx.fillStyle = 'rgba(251,191,36,0.15)'
          ctx.fillRect(x, y, cellW, cellH)
        }

        if (cell) {
          ctx.fillStyle = '#1e293b'
          ctx.font = `${Math.min(13, cellW * 0.4)}px 'JetBrains Mono', monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(String(cell.value).slice(0, 6), x + cellW / 2, y + cellH / 2)
        }
      }
    }
  }, [cells, scene.highlights])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
