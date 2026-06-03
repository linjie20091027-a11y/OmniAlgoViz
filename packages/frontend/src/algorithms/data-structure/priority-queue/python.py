import heapq


class PriorityQueue:
    """基于最小堆的优先队列，值越小优先级越高"""
    def __init__(self):
        self.heap = []

    def enqueue(self, priority: int) -> None:
        heapq.heappush(self.heap, priority)

    def dequeue(self) -> int | None:
        if not self.heap:
            return None
        return heapq.heappop(self.heap)

    def peek(self) -> int | None:
        return self.heap[0] if self.heap else None

    def is_empty(self) -> bool:
        return len(self.heap) == 0

    def size(self) -> int:
        return len(self.heap)
