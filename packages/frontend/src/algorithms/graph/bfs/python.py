from collections import deque


def bfs(graph, start):
    n = len(graph)
    visited = [False] * n
    dist = [float('inf')] * n
    dist[start] = 0
    visited[start] = True
    queue = deque([start])

    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if not visited[v]:
                visited[v] = True
                dist[v] = dist[u] + 1
                queue.append(v)

    return dist


if __name__ == '__main__':
    graph = [
        [1, 2],
        [0, 3, 4],
        [0, 4],
        [1, 5],
        [1, 2, 5],
        [3, 4],
    ]
    result = bfs(graph, 0)
    print("各节点到源点 0 的最短距离:", result)
