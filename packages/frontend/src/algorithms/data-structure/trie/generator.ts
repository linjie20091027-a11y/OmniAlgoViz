import type { Scene, TreeNodeObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

interface TrieNodeData { children: Map<string, string>; val: string; isEnd: boolean }

export default function* trieGenerator(params: { size: number }): Generator<Scene> {
  const n = Math.min(params.size, 8)
  const words = ['apple', 'app', 'apply', 'banana', 'band', 'cat', 'car', 'cart'].slice(0, n)
  const nodes = new Map<string, TrieNodeData>()
  let nodeCount = 0
  const rootId = `trie-root`
  nodes.set(rootId, { children: new Map(), val: '', isEnd: false })
  nodeCount++

  function buildTreeObjects(): TreeNodeObject[] {
    const result: TreeNodeObject[] = []
    const visited = new Set<string>()
    function dfs(id: string) {
      if (visited.has(id)) return
      visited.add(id)
      const nd = nodes.get(id)!
      result.push({
        kind: 'treeNode',
        id,
        value: nd.val || 'root',
        parentId: null, // will be set via children relation
        children: [...nd.children.values()],
        color: nd.isEnd ? COLORS.sorted : COLORS.default,
      })
      for (const childId of nd.children.values()) dfs(childId)
    }
    dfs(rootId)
    // set parentId
    for (const [parentId, nd] of nodes) {
      for (const childId of nd.children.values()) {
        const child = result.find(n => n.id === childId)
        if (child) child.parentId = parentId
      }
    }
    const root = result.find(n => n.id === rootId)
    if (root) root.parentId = null
    return result
  }

  yield { objects: buildTreeObjects(), highlights: [], codeLine: 1, description: `构建 Trie 树，插入 ${n} 个单词` }

  for (const word of words) {
    let curId = rootId
    yield {
      objects: buildTreeObjects(),
      highlights: [curId],
      codeLine: 3,
      description: `插入单词: "${word}"，从根节点开始`,
    }

    for (let i = 0; i < word.length; i++) {
      const ch = word[i]
      const cur = nodes.get(curId)!
      if (!cur.children.has(ch)) {
        const newId = `trie-${nodeCount++}`
        nodes.set(newId, { children: new Map(), val: ch, isEnd: false })
        cur.children.set(ch, newId)
      }
      curId = cur.children.get(ch)!
      yield {
        objects: buildTreeObjects().map(o => o.id === curId ? { ...o, color: COLORS.comparing } : o),
        highlights: [curId],
        codeLine: 6,
        description: `处理字符 '${ch}'${i === word.length - 1 ? ' (结尾)' : ''}`,
      }
    }
    const endNode = nodes.get(curId)!
    endNode.isEnd = true
    yield {
      objects: buildTreeObjects(),
      highlights: [curId],
      codeLine: 9,
      description: `"${word}" 插入完成，标记结尾`,
    }
  }

  yield { objects: buildTreeObjects(), highlights: [], codeLine: 12, description: `Trie 树构建完成，共 ${nodeCount} 个节点` }
}
