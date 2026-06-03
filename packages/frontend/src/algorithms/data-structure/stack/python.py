class Stack:
    def __init__(self, capacity: int):
        self.data = [0] * capacity
        self.top = 0

    def push(self, val: int) -> bool:
        if self.top >= len(self.data):
            return False  # 栈满
        self.data[self.top] = val
        self.top += 1
        return True

    def pop(self) -> int | None:
        if self.top == 0:
            return None  # 栈空
        self.top -= 1
        return self.data[self.top]

    def peek(self) -> int | None:
        if self.top == 0:
            return None
        return self.data[self.top - 1]

    def is_empty(self) -> bool:
        return self.top == 0

    def size(self) -> int:
        return self.top
