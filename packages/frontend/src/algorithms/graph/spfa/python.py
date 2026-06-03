from collections import deque


def spfa(graph, start):
    n = len(graph)
    dist = [float('inf')] * n
    dist[start] = 0
    in_queue = [False] * n
    count = [0] * n
    queue = deque([start])
    in_queue[start] = True

    while queue:
        u = queue.popleft()
        in_queue[u] = False
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
                    count[v] += 1
                    if count[v] >= n:
                        return None

    return dist


if __name__ == '__main__':
    graph = [
        [(1, 4), (2, 2)],
        [(3, 5), (2, -3)],
        [(4, 3)],
        [(5, 2)],
        [(3, -2)],
        [],
    ]
    result = spfa(graph, 0)
    if result is None:
        print("检测到负权环！")
    else:
        print("各节点到源点 0 的最短距离:", result)
