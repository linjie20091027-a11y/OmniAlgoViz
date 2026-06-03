// ============================================================
// 统一场景描述系统 — 算法可视化引擎的核心抽象
// 所有算法的 generator 只产出 Scene[] 数据，不涉及任何渲染
// ============================================================

// ──── 场景对象类型 ────

export type SceneObject =
  | BarObject
  | CellObject
  | TreeNodeObject
  | ListNodeObject
  | GraphNodeObject
  | GraphEdgeObject
  | PointObject
  | LabelObject

export interface BarObject {
  kind: 'bar'
  id: string
  value: number
  index: number
  color: string
  label?: string
}

export interface CellObject {
  kind: 'cell'
  id: string
  row: number
  col: number
  value: string | number
  color: string
}

export interface TreeNodeObject {
  kind: 'treeNode'
  id: string
  value: string | number
  parentId: string | null
  children: string[]
  color: string
  x?: number
  y?: number
}

export interface ListNodeObject {
  kind: 'listNode'
  id: string
  value: number
  prevId: string | null
  nextId: string | null
  color: string
  head: boolean
}

export interface GraphNodeObject {
  kind: 'graphNode'
  id: string
  label: string
  x?: number
  y?: number
  color: string
}

export interface GraphEdgeObject {
  kind: 'graphEdge'
  id: string
  from: string
  to: string
  weight?: number
  directed: boolean
  color: string
}

export interface PointObject {
  kind: 'point'
  id: string
  x: number
  y: number
  color: string
  selected: boolean
}

export interface LabelObject {
  kind: 'label'
  id: string
  text: string
  x: number
  y: number
  color: string
}

// ──── 场景（一个步骤帧）───

export interface Scene {
  objects: SceneObject[]
  highlights?: string[]      // 当前高亮对象 id 列表
  codeLine: number           // 关联代码行号
  description: string        // 步骤说明文字
}

// ──── 算法元数据（注册表用）───

export type VisualizerType = 'bar' | 'grid' | 'tree' | 'list' | 'graph' | 'point'

export interface AlgorithmMeta {
  id: string                 // 唯一标识，如 'bubble-sort'
  title: string
  category: string           // 'sorting' | 'data-structure' | 'fundamental' | 'graph' | 'string' | 'dp' | 'math' | 'geometry'
  visualizerType: VisualizerType
  difficulty: 1 | 2 | 3 | 4 | 5
  params: AlgorithmParam[]
  complexity: {
    time: string
    space: string
    worst?: string
  }
  stable?: boolean
}

export interface AlgorithmParam {
  key: string
  label: string
  type: 'number' | 'select' | 'text'
  default: string | number
  min?: number
  max?: number
  step?: number
  options?: string[]
}

// ──── 算法类型 —— 带生成器的完整算法 module ────

export interface AlgorithmModule {
  meta: AlgorithmMeta
  generator: (params: any) => Generator<Scene, void, unknown>
  pythonCode: string
  cppCode: string
}

// ──── 颜色 palette ────

export const COLORS: Record<string, string> = {
  default:    '#6366f1',
  comparing:  '#f59e0b',
  swapping:   '#ef4444',
  sorted:     '#10b981',
  pivot:      '#ec4899',
  selected:   '#3b82f6',
  pointer:    '#8b5cf6',
  inactive:   '#cbd5e1',
  highlight:  '#fbbf24',
}
