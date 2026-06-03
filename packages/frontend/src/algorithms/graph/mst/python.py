# 最小生成树综合比较：Kruskal vs Prim
# Kruskal: 以边为中心，排序 + 并查集
# Prim: 以顶点为中心，优先队列 + 贪心


def kruskal(edges, n):
    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))
        def find(self, x):
            while self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x
        def union(self, x, y):
            rx, ry = self.find(x), self.find(y)
            if rx == ry: return False
            self.parent[rx] = ry
            return True

    edges.sort(key=lambda e: e[2])
    dsu = DSU(n)
    mst = []
    for u, v, w in edges:
        if dsu.union(u, v):
            mst.append((u, v, w))
    return mst


def prim(adj, n):
    import heapq
    visited = [False] * n
    key = [float('inf')] * n
    key[0] = 0
    pq = [(0, 0)]
    mst = []
    while pq:
        k, u = heapq.heappop(pq)
        if visited[u]: continue
        visited[u] = True
        for v, w in adj[u]:
            if not visited[v] and w < key[v]:
                key[v] = w
                heapq.heappush(pq, (w, v))
                mst.append((u, v, w))
    return mst


if __name__ == '__main__':
    edges = [(0, 1, 4), (0, 2, 3), (1, 2, 1), (1, 3, 2),
             (2, 3, 4), (2, 4, 3), (3, 4, 2), (3, 5, 1), (4, 5, 6)]
    adj = [[] for _ in range(6)]
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))

    k_mst = kruskal(edges, 6)
    p_mst = prim(adj, 6)
    print("Kruskal MST:", k_mst)
    print("Prim MST:", p_mst)
