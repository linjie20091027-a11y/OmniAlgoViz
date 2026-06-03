class TreeNode:
    def __init__(self, val: int):
        self.val = val
        self.left: TreeNode | None = None
        self.right: TreeNode | None = None


class BST:
    def __init__(self):
        self.root: TreeNode | None = None

    def insert(self, val: int) -> None:
        self.root = self._insert(self.root, val)

    def _insert(self, node: TreeNode | None, val: int) -> TreeNode:
        if node is None:
            return TreeNode(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        elif val > node.val:
            node.right = self._insert(node.right, val)
        return node

    def search(self, val: int) -> bool:
        return self._search(self.root, val)

    def _search(self, node: TreeNode | None, val: int) -> bool:
        if node is None:
            return False
        if val == node.val:
            return True
        if val < node.val:
            return self._search(node.left, val)
        return self._search(node.right, val)

    def inorder(self) -> list[int]:
        result = []
        def dfs(node: TreeNode | None):
            if node:
                dfs(node.left)
                result.append(node.val)
                dfs(node.right)
        dfs(self.root)
        return result
