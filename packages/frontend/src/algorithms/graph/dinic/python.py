from collections import deque


class Dinic:
    def __init__(self, n):
        self.n = n
        self.capacity = [[0] * n for _ in range(n)]
        self.flow = [[0] * n for _ in range(n)]

    def add_edge(self, u, v, cap):
        self.capacity[u][v] = cap

    def bfs(self, source, sink):
        level = [-1] * self.n
        level[source] = 0
        q = deque([source])
        while q:
            u = q.popleft()
            for v in range(self.n):
                if level[v] == -1 and self.capacity[u][v] - self.flow[u][v] > 0:
                    level[v] = level[u] + 1
                    q.append(v)
        return level

    def dfs(self, u, sink, pushed, level, ptr):
        if u == sink:
            return pushed
        for v in range(ptr[u], self.n):
            if level[v] == level[u] + 1 and self.capacity[u][v] - self.flow[u][v] > 0:
                tr = min(pushed, self.capacity[u][v] - self.flow[u][v])
                f = self.dfs(v, sink, tr, level, ptr)
                if f > 0:
                    self.flow[u][v] += f
                    self.flow[v][u] -= f
                    return f
            ptr[u] += 1
        return 0

    def max_flow(self, source, sink):
        total = 0
        INF = float('inf')
        while True:
            level = self.bfs(source, sink)
            if level[sink] == -1:
                break
            ptr = [0] * self.n
            while True:
                f = self.dfs(source, sink, INF, level, ptr)
                if f == 0:
                    break
                total += f
        return total


if __name__ == '__main__':
    dinic = Dinic(6)
    edges = [(0, 1, 16), (0, 2, 13), (1, 2, 10), (1, 3, 12),
             (2, 1, 4), (2, 4, 14), (3, 2, 9), (3, 5, 20),
             (4, 3, 7), (4, 5, 4)]
    for u, v, c in edges:
        dinic.add_edge(u, v, c)
    result = dinic.max_flow(0, 5)
    print("最大流:", result)
