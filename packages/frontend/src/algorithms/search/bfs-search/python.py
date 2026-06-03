from collections import deque

def bfs_search(grid, start, end):
    n = len(grid)
    queue = deque([start])
    visited = {start}
    parent = {start: -1}

    while queue:
        cur = queue.popleft()
        if cur == end:
            # 重建路径
            path = []
            while cur != -1:
                path.append(cur)
                cur = parent[cur]
            return path[::-1]

        for nxt in (cur - 1, cur + 1):
            if 0 <= nxt < n and nxt not in visited and grid[nxt] == 0:
                visited.add(nxt)
                parent[nxt] = cur
                queue.append(nxt)

    return None
