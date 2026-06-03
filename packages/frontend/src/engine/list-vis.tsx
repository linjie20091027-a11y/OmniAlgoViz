import { useRef, useEffect, useMemo } from 'react'
import type { Scene, ListNodeObject } from '@vsa/shared'

interface Props { scene: Scene }

export default function ListVisualizer({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const nodes = useMemo(() => {
    const listObjs = scene.objects.filter((o): o is ListNodeObject => o.kind === 'listNode')
    // 构建链表顺序
    const map = new Map(listObjs.map(n => [n.id, n]))
    const heads = listObjs.filter(n => n.head)
    if (heads.length === 0) return listObjs

    const ordered: ListNodeObject[] = []
    const visited = new Set<string>()
    let cur = heads[0].id
    while (cur && map.has(cur) && !visited.has(cur)) {
      visited.add(cur)
      ordered.push(map.get(cur)!)
      cur = map.get(cur)!.nextId ?? ''
    }
    return ordered
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

    if (nodes.length === 0) return
    const NODE_W = 70
    const NODE_H = 44
    const ARROW = 30
    const totalW = nodes.length * NODE_W + (nodes.length - 1) * ARROW
    const startX = Math.max(20, (w - totalW) / 2)
    const y = h / 2 - NODE_H / 2

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const x = startX + i * (NODE_W + ARROW)
      const isHighlight = scene.highlights.includes(node.id)

      // 箭头到下一个节点
      if (i < nodes.length - 1 && node.nextId) {
        const arrowStart = x + NODE_W
        const arrowEnd = x + NODE_W + ARROW
        ctx.beginPath()
        ctx.moveTo(arrowStart, y + NODE_H / 2)
        ctx.lineTo(arrowEnd, y + NODE_H / 2)
        ctx.strokeStyle = '#cbd5e1'
        ctx.lineWidth = 2
        ctx.stroke()
        // 箭头尖
        ctx.beginPath()
        ctx.moveTo(arrowEnd, y + NODE_H / 2)
        ctx.lineTo(arrowEnd - 6, y + NODE_H / 2 - 4)
        ctx.lineTo(arrowEnd - 6, y + NODE_H / 2 + 4)
        ctx.closePath()
        ctx.fillStyle = '#cbd5e1'
        ctx.fill()
      }

      // 光晕
      if (isHighlight) {
        ctx.fillStyle = '#fbbf24'
        roundRect(ctx, x - 3, y - 3, NODE_W + 6, NODE_H + 6, 8)
      }

      // 节点主体
      ctx.fillStyle = node.color
      roundRect(ctx, x, y, NODE_W, NODE_H, 6)

      // 值文字
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(node.value), x + NODE_W / 2, y + NODE_H / 2)

      // head 标记
      if (node.head) {
        ctx.fillStyle = '#94a3b8'
        ctx.font = '10px Inter, sans-serif'
        ctx.fillText('head', x + NODE_W / 2, y - 12)
      }
    }
  }, [nodes, scene.highlights])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
}
