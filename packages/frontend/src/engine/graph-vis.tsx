import { useRef, useEffect, useMemo } from 'react'
import type { Scene, GraphNodeObject, GraphEdgeObject } from '@vsa/shared'

interface Props { scene: Scene }

interface LayoutNode { id: string; label: string; color: string; x: number; y: number }

export default function GraphVisualizer({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { nodes, edges } = useMemo(() => {
    const gNodes = scene.objects.filter((o): o is GraphNodeObject => o.kind === 'graphNode')
    const gEdges = scene.objects.filter((o): o is GraphEdgeObject => o.kind === 'graphEdge')

    // Simple force-directed-like layout: circular for first-level, radial for others
    const NODE_R = 28
    const cx = 0, cy = 0
    const radius = Math.min(200, gNodes.length * 28)

    const layoutNodes: LayoutNode[] = gNodes.map((n, i) => {
      const angle = (2 * Math.PI / gNodes.length) * i - Math.PI / 2
      return {
        id: n.id,
        label: n.label,
        color: n.color,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      }
    })
    return { nodes: layoutNodes, edges: gEdges }
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

    const ox = w / 2
    const oy = h / 2
    const nodeMap = new Map(nodes.map(n => [n.id, n]))
    const NODE_R = 26

    // 绘制边
    for (const edge of edges) {
      const from = nodeMap.get(edge.from)
      const to = nodeMap.get(edge.to)
      if (!from || !to) continue

      const dx = to.x - from.x
      const dy = to.y - from.y
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len === 0) continue
      const normX = dx / len
      const normY = dy / len

      ctx.beginPath()
      ctx.moveTo(ox + from.x + normX * NODE_R, oy + from.y + normY * NODE_R)
      ctx.lineTo(ox + to.x - normX * (NODE_R + 10), oy + to.y - normY * (NODE_R + 10))
      ctx.strokeStyle = edge.color || '#cbd5e1'
      ctx.lineWidth = scene.highlights?.includes(edge.id) ? 3 : 1.5
      ctx.stroke()

      // 箭头（有向图）
      if (edge.directed) {
        const tipX = ox + to.x - normX * NODE_R
        const tipY = oy + to.y - normY * NODE_R
        const tipLen = 8
        ctx.beginPath()
        ctx.moveTo(tipX, tipY)
        ctx.lineTo(tipX - normX * tipLen + normY * 5, tipY - normY * tipLen - normX * 5)
        ctx.lineTo(tipX - normX * tipLen - normY * 5, tipY - normY * tipLen + normX * 5)
        ctx.closePath()
        ctx.fillStyle = edge.color || '#94a3b8'
        ctx.fill()
      }

      // 权重标签
      if (edge.weight !== undefined) {
        const mx = ox + (from.x + to.x) / 2 + normY * 14
        const my = oy + (from.y + to.y) / 2 - normX * 14
        ctx.fillStyle = '#94a3b8'
        ctx.font = '11px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(edge.weight), mx, my)
      }
    }

    // 绘制节点
    for (const node of nodes) {
      const x = ox + node.x
      const y = oy + node.y
      const hi = scene.highlights?.includes(node.id)

      if (hi) {
        ctx.beginPath()
        ctx.arc(x, y, NODE_R + 4, 0, Math.PI * 2)
        ctx.fillStyle = '#fbbf24'
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(x, y, NODE_R, 0, Math.PI * 2)
      ctx.fillStyle = node.color
      ctx.fill()
      ctx.strokeStyle = hi ? '#fbbf24' : 'rgba(0,0,0,0.08)'
      ctx.lineWidth = hi ? 3 : 1.5
      ctx.stroke()

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 12px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const txt = node.label.length > 4 ? node.label.slice(0, 4) : node.label
      ctx.fillText(txt, x, y)
    }
  }, [nodes, edges, scene.highlights])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
