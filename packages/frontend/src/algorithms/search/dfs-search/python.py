def dfs_search(grid, start, end):
    n = len(grid)
    visited = set()
    path = []

    def dfs(cur):
        visited.add(cur)
        path.append(cur)

        if cur == end:
            return True

        for nxt in (cur + 1, cur - 1):
            if 0 <= nxt < n and nxt not in visited and grid[nxt] == 0:
                if dfs(nxt):
                    return True

        path.pop()
        return False

    if dfs(start):
        return path
    return None
