import heapq


def dijkstra(graph, start):
    n = len(graph)
    dist = [float('inf')] * n
    dist[start] = 0
    visited = [False] * n
    pq = [(0, start)]

    while pq:
        d, u = heapq.heappop(pq)
        if visited[u]:
            continue
        visited[u] = True
        for v, w in graph[u]:
            if not visited[v] and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))

    return dist


if __name__ == '__main__':
    graph = [
        [(1, 4), (2, 2)],
        [(3, 5), (2, 1)],
        [(4, 3)],
        [(5, 2)],
        [(3, 1), (5, 6)],
        [],
    ]
    result = dijkstra(graph, 0)
    print("各节点到源点 0 的最短距离:", result)
