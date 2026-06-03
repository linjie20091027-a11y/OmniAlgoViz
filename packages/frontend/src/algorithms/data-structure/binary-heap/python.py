class MinHeap:
    def __init__(self):
        self.heap = []

    def push(self, val: int) -> None:
        self.heap.append(val)
        self._bubble_up(len(self.heap) - 1)

    def pop(self) -> int | None:
        if not self.heap:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._bubble_down(0)
        return root

    def peek(self) -> int | None:
        return self.heap[0] if self.heap else None

    def _bubble_up(self, idx: int) -> None:
        while idx > 0:
            parent = (idx - 1) // 2
            if self.heap[parent] <= self.heap[idx]:
                break
            self.heap[parent], self.heap[idx] = self.heap[idx], self.heap[parent]
            idx = parent

    def _bubble_down(self, idx: int) -> None:
        n = len(self.heap)
        while True:
            smallest = idx
            left = 2 * idx + 1
            right = 2 * idx + 2
            if left < n and self.heap[left] < self.heap[smallest]:
                smallest = left
            if right < n and self.heap[right] < self.heap[smallest]:
                smallest = right
            if smallest == idx:
                break
            self.heap[idx], self.heap[smallest] = self.heap[smallest], self.heap[idx]
            idx = smallest

    def size(self) -> int:
        return len(self.heap)
