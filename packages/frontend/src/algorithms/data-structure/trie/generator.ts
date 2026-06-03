import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

interface TrieNode {
  children: Map<string, number>
  isEnd: boolean
  char: string
  id: number
}

let nodeCounter = 0

function newNode(char: string): TrieNode {
  return { children: new Map(), isEnd: false, char, id: nodeCounter++ }
}

function collectNodes(root: TrieNode): TrieNode[] {
  const nodes: TrieNode[] = [root]
  const queue = [root]
  while (queue.length > 0) {
    const cur = queue.shift()!
    for (const child of cur.children.values()) {
      nodes.push(nodes[child])
      queue.push(nodes[child])
    }
  }
  return nodes
}

function toBars(nodes: TrieNode[], highlights: string[] = []): BarObject[] {
  return nodes.map((node, i) => {
    let color = COLORS.default
    if (i === 0) color = COLORS.pointer
    if (highlights.includes(`trie-${i}`)) color = COLORS.highlight
    if (node.isEnd) color = COLORS.sorted
    const val = 1
    return mkBar(`trie-${i}`, val, i, color, `'${node.char}'${node.isEnd ? '*' : ''}`)
  })
}

export default function* trieGenerator(params: { size: number }): Generator<Scene> {
  nodeCounter = 0
  const words = ['cat', 'car', 'dog', 'card', 'do', 'carpet', 'cab', 'apple', 'ape', 'banana'].slice(0, Math.min(params.size, 10))

  const root = newNode('^')
  const allNodes: TrieNode[] = [root]

  yield {
    objects: toBars(allNodes),
    highlights: [],
    codeLine: 1,
    description: `初始化字典树，准备插入单词：[${words.join(', ')}]`,
  }

  for (const word of words) {
    let cur = root
    yield {
      objects: toBars(allNodes),
      highlights: [`trie-${cur.id}`],
      codeLine: 3,
      description: `开始插入单词 "${word}"，从根节点开始`,
    }

    for (let i = 0; i < word.length; i++) {
      const ch = word[i]
      if (cur.children.has(ch)) {
        cur = allNodes[cur.children.get(ch)!]
        yield {
          objects: toBars(allNodes, [`trie-${cur.id}`]),
          highlights: [`trie-${cur.id}`],
          codeLine: 5,
          description: `字符 '${ch}' 已存在，移动到对应节点`,
        }
      } else {
        const newN = newNode(ch)
        allNodes.push(newN)
        cur.children.set(ch, newN.id)
        cur = newN
        yield {
          objects: toBars(allNodes, [`trie-${newN.id}`]),
          highlights: [`trie-${newN.id}`],
          codeLine: 7,
          description: `字符 '${ch}' 不存在，创建新节点`,
        }
      }
    }

    cur.isEnd = true
    yield {
      objects: toBars(allNodes, [`trie-${cur.id}`]),
      highlights: [`trie-${cur.id}`],
      codeLine: 9,
      description: `单词 "${word}" 插入完成，标记节点 ${cur.id} 为单词结尾`,
    }
  }

  yield {
    objects: toBars(allNodes),
    highlights: [],
    codeLine: 10,
    description: `字典树构建完成，共 ${allNodes.length} 个节点`,
  }
}
