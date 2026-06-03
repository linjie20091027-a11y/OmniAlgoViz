class ACNode:
    def __init__(self):
        self.next = {}
        self.fail = 0
        self.out = []

class ACAutomaton:
    def __init__(self, patterns):
        self.trie = [ACNode()]
        # 构建 Trie
        for p in patterns:
            self._insert(p)
        # 构建失败链接
        self._build_fail()

    def _insert(self, s):
        cur = 0
        for ch in s:
            if ch not in self.trie[cur].next:
                self.trie.append(ACNode())
                self.trie[cur].next[ch] = len(self.trie) - 1
            cur = self.trie[cur].next[ch]
        self.trie[cur].out.append(s)

    def _build_fail(self):
        from collections import deque
        q = deque()
        # 第一层
        for ch, v in self.trie[0].next.items():
            self.trie[v].fail = 0
            q.append(v)
        # BFS
        while q:
            u = q.popleft()
            for ch, v in self.trie[u].next.items():
                f = self.trie[u].fail
                while f > 0 and ch not in self.trie[f].next:
                    f = self.trie[f].fail
                self.trie[v].fail = self.trie[f].next[ch] if ch in self.trie[f].next else 0
                self.trie[v].out.extend(self.trie[self.trie[v].fail].out)
                q.append(v)

    def search(self, text):
        cur = 0
        result = []
        for i, ch in enumerate(text):
            while cur > 0 and ch not in self.trie[cur].next:
                cur = self.trie[cur].fail
            cur = self.trie[cur].next.get(ch, 0)
            for word in self.trie[cur].out:
                result.append((i - len(word) + 1, word))
        return result
