class CircularQueue:
    def __init__(self, capacity: int):
        self.data = [0] * capacity
        self.capacity = capacity
        self.front = 0
        self.rear = 0
        self.size = 0

    def enqueue(self, val: int) -> bool:
        if self.size >= self.capacity:
            return False
        self.data[self.rear] = val
        self.rear = (self.rear + 1) % self.capacity
        self.size += 1
        return True

    def dequeue(self) -> int | None:
        if self.size == 0:
            return None
        val = self.data[self.front]
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return val

    def peek(self) -> int | None:
        if self.size == 0:
            return None
        return self.data[self.front]

    def is_empty(self) -> bool:
        return self.size == 0

    def is_full(self) -> bool:
        return self.size == self.capacity
