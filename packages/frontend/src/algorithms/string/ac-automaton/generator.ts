import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string, label?: string): BarObject {
  return { kind: 'bar', id, value, index, color, label }
}

interface ACNode {
  next: Record<string, number>
  fail: number
  out: string[]
}

export default function* acAutomaton(params: { size: number }): Generator<Scene> {
  const k = params.size
  const words = ['he', 'she', 'his', 'hers'].slice(0, k)
  const text = 'ushers'

  // 展示模式串
  yield {
    objects: words.flatMap((w, wi) =>
      w.split('').map((c, ci) => mkBar(`w${wi}-${ci}`, c.charCodeAt(0) - 96, ci, COLORS.default, c))
    ),
    highlights: [],
    codeLine: 1,
    description: `模式串: ${words.join(', ')}，文本: "${text}"`,
  }

  // 构建 Trie
  const trie: ACNode[] = [{ next: {}, fail: 0, out: [] }]

  for (let wi = 0; wi < words.length; wi++) {
    let cur = 0
    for (let ci = 0; ci < words[wi].length; ci++) {
      const ch = words[wi][ci]
      if (!trie[cur].next[ch]) {
        trie.push({ next: {}, fail: 0, out: [] })
        trie[cur].next[ch] = trie.length - 1
      }
      cur = trie[cur].next[ch]
    }
    trie[cur].out.push(words[wi])

    yield {
      objects: words[wi].split('').map((c, ci) =>
        mkBar(`trie-${wi}-${ci}`, c.charCodeAt(0) - 96, ci, ci === words[wi].length - 1 ? COLORS.sorted : COLORS.default, c)
      ),
      highlights: [],
      codeLine: 4,
      description: `插入 "${words[wi]}" 到 Trie，当前节点数: ${trie.length}`,
    }
  }

  // 构建失败链接 (BFS)
  const queue: number[] = []
  for (const ch in trie[0].next) {
    const v = trie[0].next[ch]
    trie[v].fail = 0
    queue.push(v)
  }

  while (queue.length > 0) {
    const u = queue.shift()!
    const stateBars = trie.map((node, i) =>
      mkBar(`node-${i}`, node.out.length, i, i === u ? COLORS.comparing : COLORS.default, `${i}`)
    )

    yield {
      objects: stateBars,
      highlights: [`node-${u}`],
      codeLine: 10,
      description: `构建节点 ${u} 的失败链接`,
    }

    for (const ch in trie[u].next) {
      const v = trie[u].next[ch]
      let f = trie[u].fail
      while (f > 0 && !trie[f].next[ch]) f = trie[f].fail
      trie[v].fail = trie[f].next[ch] || 0
      trie[v].out.push(...trie[trie[v].fail].out)
      queue.push(v)
    }
  }

  yield {
    objects: trie.map((node, i) =>
      mkBar(`node-${i}`, node.out.length, i, node.out.length > 0 ? COLORS.sorted : COLORS.default, `${i}→fail:${node.fail}`)
    ),
    highlights: [],
    codeLine: 16,
    description: `失败链接构建完成，共 ${trie.length} 个节点`,
  }

  // 匹配文本
  let cur = 0
  const output: { pos: number; word: string }[] = []
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    while (cur > 0 && !trie[cur].next[ch]) cur = trie[cur].fail
    cur = trie[cur].next[ch] || 0

    if (trie[cur].out.length > 0) {
      output.push(...trie[cur].out.map(w => ({ pos: i - w.length + 1, word: w })))
    }

    yield {
      objects: text.split('').map((c, j) =>
        mkBar(`txt-${j}`, c.charCodeAt(0) - 96, j, j === i ? COLORS.comparing : COLORS.default, c)
      ),
      highlights: [`txt-${i}`],
      codeLine: 20,
      description: `处理 text[${i}]="${ch}"，当前状态=${cur}` + (trie[cur].out.length > 0 ? `，匹配: ${trie[cur].out.join(',')}` : ''),
    }
  }

  const finalBars = text.split('').map((c, i) =>
    mkBar(`txt-${i}`, c.charCodeAt(0) - 96, i,
      output.some(o => i >= o.pos && i < o.pos + o.word.length) ? COLORS.sorted : COLORS.default, c)
  )
  yield { objects: finalBars, highlights: [], codeLine: 25, description: `匹配完成，共找到 ${output.length} 处匹配` }
}
