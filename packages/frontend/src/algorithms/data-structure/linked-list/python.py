class ListNode:
    def __init__(self, val: int):
        self.val = val
        self.next: ListNode | None = None


class LinkedList:
    def __init__(self):
        self.head: ListNode | None = None

    def insert(self, val: int, pos: int) -> None:
        node = ListNode(val)
        if pos == 0:
            node.next = self.head
            self.head = node
            return
        curr = self.head
        for _ in range(pos - 1):
            if curr is None:
                return
            curr = curr.next
        if curr:
            node.next = curr.next
            curr.next = node

    def delete(self, pos: int) -> None:
        if self.head is None:
            return
        if pos == 0:
            self.head = self.head.next
            return
        curr = self.head
        for _ in range(pos - 1):
            if curr is None:
                return
            curr = curr.next
        if curr and curr.next:
            curr.next = curr.next.next

    def search(self, val: int) -> int:
        curr = self.head
        idx = 0
        while curr:
            if curr.val == val:
                return idx
            curr = curr.next
            idx += 1
        return -1

    def to_list(self) -> list[int]:
        result = []
        curr = self.head
        while curr:
            result.append(curr.val)
            curr = curr.next
        return result
