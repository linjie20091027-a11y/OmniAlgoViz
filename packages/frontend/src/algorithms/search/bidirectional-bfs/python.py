from collections import deque

def bidirectional_bfs(grid, start, end):
    n = len(grid)
    if start == end:
        return [start]

    qf, qb = deque([start]), deque([end])
    vf, vb = {start}, {end}
    pf, pb = {start: -1}, {end: -1}

    def expand(q, visited, other_visited, parent, other_parent):
        cur = q.popleft()
        for nxt in (cur - 1, cur + 1):
            if 0 <= nxt < n and grid[nxt] == 0 and nxt not in visited:
                visited.add(nxt)
                parent[nxt] = cur
                q.append(nxt)
                if nxt in other_visited:
                    return nxt
        return None

    while qf and qb:
        meet = expand(qf, vf, vb, pf, pb)
        if meet is not None:
            path = []
            cur = meet
            while cur != -1:
                path.append(cur)
                cur = pf[cur]
            path.reverse()
            cur = pb[meet]
            while cur != -1:
                path.append(cur)
                cur = pb[cur]
            return path

        meet = expand(qb, vb, vf, pb, pf)
        if meet is not None:
            path = []
            cur = meet
            while cur != -1:
                path.append(cur)
                cur = pf[cur]
            path.reverse()
            cur = pb[meet]
            while cur != -1:
                path.append(cur)
                cur = pb[cur]
            return path

    return None
