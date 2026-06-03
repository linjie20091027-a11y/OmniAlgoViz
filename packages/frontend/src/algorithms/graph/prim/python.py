import heapq


def prim(graph, start):
    n = len(graph)
    visited = [False] * n
    key = [float('inf')] * n
    key[start] = 0
    parent = [-1] * n
    pq = [(0, start)]

    while pq:
        k, u = heapq.heappop(pq)
        if visited[u]:
            continue
        visited[u] = True
        for v, w in graph[u]:
            if not visited[v] and w < key[v]:
                key[v] = w
                parent[v] = u
                heapq.heappush(pq, (w, v))

    mst = []
    for v in range(n):
        if parent[v] != -1:
            mst.append((parent[v], v, key[v]))
    return mst, sum(e[2] for e in mst)


if __name__ == '__main__':
    graph = [
        [(1, 4), (2, 3)],
        [(0, 4), (2, 1), (3, 2)],
        [(0, 3), (1, 1), (3, 4), (4, 3)],
        [(1, 2), (2, 4), (4, 2), (5, 1)],
        [(2, 3), (3, 2), (5, 6)],
        [(3, 1), (4, 6)],
    ]
    mst, weight = prim(graph, 0)
    print("MST 边:", mst)
    print("总权重:", weight)
