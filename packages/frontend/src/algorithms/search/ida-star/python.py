def ida_star(grid, start, end):
    n = len(grid)

    def h(pos):
        return abs(end - pos)

    def search(path, g, threshold, visited):
        node = path[-1]
        f = g + h(node)

        if f > threshold:
            return f, False
        if node == end:
            return threshold, True

        min_cost = float('inf')
        for nxt in (node + 1, node - 1):
            if 0 <= nxt < n and grid[nxt] == 0 and nxt not in visited:
                visited.add(nxt)
                path.append(nxt)
                cost, found = search(path, g + 1, threshold, visited)
                if found:
                    return cost, True
                min_cost = min(min_cost, cost)
                path.pop()
                visited.remove(nxt)

        return min_cost, False

    threshold = h(start)
    path = [start]
    while True:
        visited = {start}
        cost, found = search(path, 0, threshold, visited)
        if found:
            return path
        if cost == float('inf'):
            return None
        threshold = cost
