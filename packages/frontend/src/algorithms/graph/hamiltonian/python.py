def hamiltonian_path(graph):
    n = len(graph)
    path = []

    def backtrack(u, visited):
        visited[u] = True
        path.append(u)
        if len(path) == n:
            return True
        for v in graph[u]:
            if not visited[v]:
                if backtrack(v, visited):
                    return True
        visited[u] = False
        path.pop()
        return False

    for start in range(n):
        visited = [False] * n
        path.clear()
        if backtrack(start, visited):
            return list(path)

    return None


if __name__ == '__main__':
    graph = [
        [1, 2, 3],
        [0, 2, 4],
        [0, 1, 3],
        [0, 2, 4],
        [1, 3],
    ]
    result = hamiltonian_path(graph)
    if result is None:
        print("不存在哈密顿路径")
    else:
        print("哈密顿路径:", result)
