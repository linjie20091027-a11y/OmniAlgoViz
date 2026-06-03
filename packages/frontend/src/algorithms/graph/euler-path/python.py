def euler_path(graph):
    n = len(graph)
    degree = [len(adj) for adj in graph]
    odd_nodes = [i for i in range(n) if degree[i] % 2 != 0]

    if len(odd_nodes) > 2:
        return None

    adj = [list(neighbors) for neighbors in graph]
    start = odd_nodes[0] if odd_nodes else 0

    path = []
    stack = [start]

    while stack:
        u = stack[-1]
        if adj[u]:
            v = adj[u].pop()
            adj[v].remove(u)
            stack.append(v)
        else:
            path.append(stack.pop())

    return path


if __name__ == '__main__':
    graph = [
        [1, 2, 3],
        [0, 2],
        [0, 1, 3, 4],
        [0, 2, 4],
        [2, 3],
    ]
    result = euler_path(graph)
    if result is None:
        print("不存在欧拉路径")
    else:
        print("欧拉路径/回路:", result)
