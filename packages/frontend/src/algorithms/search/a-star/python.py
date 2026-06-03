import heapq

def a_star(grid, start, end):
    n = len(grid)

    def h(pos):
        return abs(end - pos)

    open_set = [(h(start), 0, start)]  # (f, g, pos)
    g_score = {start: 0}
    parent = {start: -1}
    closed = set()

    while open_set:
        f, g, cur = heapq.heappop(open_set)
        if cur in closed:
            continue
        closed.add(cur)

        if cur == end:
            path = []
            while cur != -1:
                path.append(cur)
                cur = parent[cur]
            return path[::-1]

        for nxt in (cur - 1, cur + 1):
            if 0 <= nxt < n and grid[nxt] == 0 and nxt not in closed:
                tent_g = g + 1
                if tent_g < g_score.get(nxt, float('inf')):
                    g_score[nxt] = tent_g
                    parent[nxt] = cur
                    heapq.heappush(open_set, (tent_g + h(nxt), tent_g, nxt))

    return None
