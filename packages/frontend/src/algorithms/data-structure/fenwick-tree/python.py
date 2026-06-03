class FenwickTree:
    def __init__(self, n: int):
        self.n = n
        self.tree = [0] * (n + 1)

    def build(self, arr: list[int]) -> None:
        for i in range(len(arr)):
            idx = i + 1
            while idx <= self.n:
                self.tree[idx] += arr[i]
                idx += idx & -idx

    def add(self, idx: int, delta: int) -> None:
        while idx <= self.n:
            self.tree[idx] += delta
            idx += idx & -idx

    def prefix_sum(self, idx: int) -> int:
        total = 0
        while idx > 0:
            total += self.tree[idx]
            idx -= idx & -idx
        return total

    def range_sum(self, l: int, r: int) -> int:
        return self.prefix_sum(r) - self.prefix_sum(l - 1)
