class StringHash:
    def __init__(self, s: str, base=131, mod=10 ** 9 + 7):
        self.base = base
        self.mod = mod
        n = len(s)
        self.hash = [0] * (n + 1)
        self.pow = [1] * (n + 1)
        for i, ch in enumerate(s):
            self.hash[i + 1] = (self.hash[i] * base + ord(ch) - 96) % mod
            self.pow[i + 1] = (self.pow[i] * base) % mod

    def get_hash(self, l: int, r: int) -> int:
        """获取子串 s[l..r] (闭区间) 的哈希值"""
        return (self.hash[r + 1] - self.hash[l] * self.pow[r - l + 1]) % self.mod
