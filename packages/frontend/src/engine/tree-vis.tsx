import { useRef, useEffect, useMemo } from 'react'
import type { Scene, TreeNodeObject } from '@vsa/shared'

interface Props { scene: Scene }

interface LayoutNode {
  id: string
  value: string | number
  color: string
  x: number
  y: number
  children: string[]
}

export default function TreeVisualizer({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const treeData = useMemo(() => {
    const nodes = scene.objects.filter((o): o is TreeNodeObject => o.kind === 'treeNode')
    const map = new Map<string, TreeNodeObject>()
    for (const n of nodes) map.set(n.id, n)

    const roots = nodes.filter(n => n.parentId === null)
    if (roots.length === 0) return { nodes: [], edges: [] as [number, number, number, number][] }

    const layoutNodes: LayoutNode[] = []
    const positionMap = new Map<string, { x: number; y: number }>()
    const edges: [number, number, number, number][] = []

    function layout(nodeId: string, depth: number, left: number, right: number) {
      const node = map.get(nodeId)
      if (!node) return

      const x = (left + right) / 2
      const y = depth * 80 + 60
      positionMap.set(nodeId, { x, y })

      const children = node.children.filter(id => map.has(id))
      const ln: LayoutNode = {
        id: nodeId,
        value: node.value,
        color: node.color,
        x,
        y,
        children,
      }
      layoutNodes.push(ln)

      const width = (right - left) / children.length
      children.forEach((childId, i) => {
        const childX = left + width * (i + 0.5)
        const childY = (depth + 1) * 80 + 60
        layout(childId, depth + 1, left + width * i, left + width * (i + 1))
        edges.push([x, y, childX, childY])
      })
    }

    roots.forEach(r => layout(r.id, 0, 60, 900))
    return { nodes: layoutNodes, edges }
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

    const { nodes, edges } = treeData
    const NODE_R = 24

    // 画边
    for (const [x1, y1, x2, y2] of edges) {
      ctx.beginPath()
      ctx.moveTo(x1, y1 + NODE_R)
      ctx.lineTo(x2, y2 - NODE_R)
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // 画节点
    for (const node of nodes) {
      const isHighlight = scene.highlights.includes(node.id)

      // 外圈光晕
      if (isHighlight) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, NODE_R + 5, 0, Math.PI * 2)
        ctx.fillStyle = '#fbbf24'
        ctx.fill()
      }

      // 节点圆
      ctx.beginPath()
      ctx.arc(node.x, node.y, NODE_R, 0, Math.PI * 2)
      ctx.fillStyle = node.color
      ctx.fill()
      ctx.strokeStyle = isHighlight ? '#fbbf24' : 'rgba(0,0,0,0.1)'
      ctx.lineWidth = isHighlight ? 3 : 1.5
      ctx.stroke()

      // 值文字
      const valStr = String(node.value)
      ctx.fillStyle = '#fff'
      ctx.font = `bold ${Math.min(NODE_R, 14)}px 'JetBrains Mono', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(valStr.length > 4 ? valStr.slice(0, 4) : valStr, node.x, node.y)
    }
  }, [treeData, scene.highlights])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
