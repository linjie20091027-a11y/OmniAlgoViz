import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

interface BSTNode {
  val: number
  left: BSTNode | null
  right: BSTNode | null
}

function flattenInOrder(root: BSTNode | null): number[] {
  const result: number[] = []
  function dfs(node: BSTNode | null) {
    if (!node) return
    dfs(node.left)
    result.push(node.val)
    dfs(node.right)
  }
  dfs(root)
  return result
}

function toBars(root: BSTNode | null, n: number, highlights: string[] = [], focusVal: number | null = null): BarObject[] {
  const inorder = flattenInOrder(root)
  const bars: BarObject[] = []
  for (let i = 0; i < n; i++) {
    if (i < inorder.length) {
      let color = COLORS.default
      if (highlights.includes(`bst-${i}`)) color = COLORS.highlight
      if (focusVal === inorder[i]) color = COLORS.comparing
      if (i === 0) color = COLORS.sorted
      bars.push(mkBar(`bst-${i}`, inorder[i], i, color))
    } else {
      bars.push(mkBar(`bst-${i}`, 0, i, COLORS.inactive))
    }
  }
  return bars
}

function insert(root: BSTNode | null, val: number, scenes: Scene[], n: number): BSTNode {
  if (!root) {
    scenes.push({
      objects: toBars({ val, left: null, right: null }, n, [`bst-0`], val),
      highlights: [`bst-0`],
      codeLine: 4,
      description: `插入新节点 ${val}`,
    })
    return { val, left: null, right: null }
  }

  scenes.push({
    objects: toBars(root, n, [], val),
    highlights: [],
    codeLine: 5,
    description: `比较 ${val} 与当前节点 ${root.val}`,
  })

  if (val < root.val) {
    scenes.push({
      objects: toBars(root, n, [], val),
      highlights: [],
      codeLine: 6,
      description: `${val} < ${root.val}，进入左子树`,
    })
    root.left = insert(root.left, val, scenes, n)
  } else if (val > root.val) {
    scenes.push({
      objects: toBars(root, n, [], val),
      highlights: [],
      codeLine: 8,
      description: `${val} > ${root.val}，进入右子树`,
    })
    root.right = insert(root.right, val, scenes, n)
  }

  return root
}

export default function* bstGenerator(params: { size: number }): Generator<Scene> {
  const n = params.size
  const vals = Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 1)

  yield {
    objects: new Array(n).fill(0).map((_, i) => mkBar(`bst-${i}`, 0, i, COLORS.inactive)),
    highlights: [],
    codeLine: 1,
    description: `初始化空二叉搜索树，准备插入 ${n} 个元素`,
  }

  const scenes: Scene[] = []
  let root: BSTNode | null = null

  yield {
    objects: toBars(null, n),
    highlights: [],
    codeLine: 2,
    description: `待插入元素：[${vals.join(', ')}]`,
  }

  for (const val of vals) {
    root = insert(root, val, scenes, n)
    yield* scenes
    scenes.length = 0

    const inorder = flattenInOrder(root)
    yield {
      objects: inorder.map((v, i) => {
        let color = COLORS.default
        if (i === 0) color = COLORS.sorted
        return mkBar(`bst-${i}`, v, i, color)
      }),
      highlights: [],
      codeLine: 10,
      description: `${val} 插入完成，中序序列：[${inorder.join(', ')}]`,
    }
  }

  const final = flattenInOrder(root)
  yield {
    objects: final.map((v, i) => mkBar(`bst-${i}`, v, i, COLORS.sorted)),
    highlights: [],
    codeLine: 12,
    description: `BST 构建完成，中序遍历结果：[${final.join(', ')}]（升序）`,
  }
}
