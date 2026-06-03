import type { Scene, TreeNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

export default function* bstGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const values = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 10)
  const treeNodes: Map<string, { value: number; left: string | null; right: string | null; parent: string | null }> = new Map()
  const insertedIds: string[] = []
  let rootId: string | null = null

  function buildTreeObjects(): TreeNodeObject[] {
    const result: TreeNodeObject[] = []
    const visited = new Set<string>()
    function dfs(id: string | null) {
      if (!id || visited.has(id)) return
      visited.add(id)
      const node = treeNodes.get(id)!
      result.push({
        kind: 'treeNode',
        id,
        value: node.value,
        parentId: node.parent,
        children: [node.left, node.right].filter(Boolean) as string[],
        color: COLORS.default,
      })
      dfs(node.left)
      dfs(node.right)
    }
    dfs(rootId)
    return result
  }

  function* insert(value: number): Generator<Scene> {
    const id = `node-${value}-${Date.now()}`
    treeNodes.set(id, { value, left: null, right: null, parent: null })

    if (!rootId) {
      rootId = id
      insertedIds.push(id)
      yield {
        objects: buildTreeObjects(),
        highlights: [id],
        codeLine: 3,
        description: `插入根节点 ${value}`,
      }
      return
    }

    let cur = rootId
    while (true) {
      const curNode = treeNodes.get(cur)!
      yield {
        objects: buildTreeObjects().map(n => n.id === cur ? { ...n, color: COLORS.comparing } : n),
        highlights: [cur],
        codeLine: 5,
        description: `比较 ${value} 与当前节点 ${curNode.value}`,
      }

      if (value < curNode.value) {
        if (!curNode.left) {
          curNode.left = id
          treeNodes.get(id)!.parent = cur
          insertedIds.push(id)
          yield {
            objects: buildTreeObjects(),
            highlights: [id],
            codeLine: 7,
            description: `${value} < ${curNode.value}，插入为左子节点`,
          }
          return
        }
        cur = curNode.left
      } else {
        if (!curNode.right) {
          curNode.right = id
          treeNodes.get(id)!.parent = cur
          insertedIds.push(id)
          yield {
            objects: buildTreeObjects(),
            highlights: [id],
            codeLine: 9,
            description: `${value} >= ${curNode.value}，插入为右子节点`,
          }
          return
        }
        cur = curNode.right
      }
    }
  }

  yield {
    objects: [],
    highlights: [],
    codeLine: 1,
    description: `准备插入 ${n} 个随机值到二叉搜索树`,
  }

  for (const v of values) {
    yield* insert(v)
  }

  yield {
    objects: buildTreeObjects(),
    highlights: [],
    codeLine: 12,
    description: `二叉搜索树构建完成，共 ${insertedIds.length} 个节点`,
  }
}
