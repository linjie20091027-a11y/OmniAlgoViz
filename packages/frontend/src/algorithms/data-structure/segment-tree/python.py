class SegmentTree:
    def __init__(self, arr: list[int]):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self._build(arr, 1, 0, self.n - 1)

    def _build(self, arr: list[int], node: int, l: int, r: int) -> int:
        if l == r:
            self.tree[node] = arr[l]
            return self.tree[node]
        mid = (l + r) // 2
        left_sum = self._build(arr, node * 2, l, mid)
        right_sum = self._build(arr, node * 2 + 1, mid + 1, r)
        self.tree[node] = left_sum + right_sum
        return self.tree[node]

    def update(self, idx: int, val: int, node: int = 1, l: int = 0, r: int | None = None) -> None:
        if r is None:
            r = self.n - 1
        if l == r:
            self.tree[node] = val
            return
        mid = (l + r) // 2
        if idx <= mid:
            self.update(idx, val, node * 2, l, mid)
        else:
            self.update(idx, val, node * 2 + 1, mid + 1, r)
        self.tree[node] = self.tree[node * 2] + self.tree[node * 2 + 1]

    def query(self, ql: int, qr: int, node: int = 1, l: int = 0, r: int | None = None) -> int:
        if r is None:
            r = self.n - 1
        if ql <= l and r <= qr:
            return self.tree[node]
        if qr < l or r < ql:
            return 0
        mid = (l + r) // 2
        return self.query(ql, qr, node * 2, l, mid) + \
               self.query(ql, qr, node * 2 + 1, mid + 1, r)
