def dfs(graph):
    n = len(graph)
    visited = [False] * n
    order = [-1] * n
    time = [0]

    def dfs_visit(u):
        visited[u] = True
        order[u] = time[0]
        time[0] += 1
        for v in graph[u]:
            if not visited[v]:
                dfs_visit(v)

    for i in range(n):
        if not visited[i]:
            dfs_visit(i)

    return order


if __name__ == '__main__':
    graph = [
        [1, 2],
        [0, 3, 4],
        [0, 4],
        [1, 5],
        [1, 2, 5],
        [3, 4],
    ]
    result = dfs(graph)
    print("各节点的发现顺序:", result)
