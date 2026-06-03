class HashTable:
    def __init__(self, size: int = 7):
        self.size = size
        self.table = [[] for _ in range(size)]

    def _hash(self, key: int) -> int:
        return key % self.size

    def insert(self, key: int) -> None:
        bucket = self._hash(key)
        for v in self.table[bucket]:
            if v == key:
                return  # 已存在，不重复插入
        self.table[bucket].append(key)

    def search(self, key: int) -> bool:
        bucket = self._hash(key)
        return key in self.table[bucket]

    def delete(self, key: int) -> bool:
        bucket = self._hash(key)
        for i, v in enumerate(self.table[bucket]):
            if v == key:
                self.table[bucket].pop(i)
                return True
        return False

    def display(self) -> list[list[int]]:
        return self.table
