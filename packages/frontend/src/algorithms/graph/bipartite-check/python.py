from collections import deque


def is_bipartite(graph):
    n = len(graph)
    color = [-1] * n

    for start in range(n):
        if color[start] != -1:
            continue
        color[start] = 0
        queue = deque([start])

        while queue:
            u = queue.popleft()
            for v in graph[u]:
                if color[v] == -1:
                    color[v] = 1 - color[u]
                    queue.append(v)
                elif color[v] == color[u]:
                    return False, color

    return True, color


if __name__ == '__main__':
    graph = [
        [3, 4],
        [3, 5],
        [4],
        [0, 1],
        [0, 2, 5],
        [1, 4],
    ]
    is_bip, coloring = is_bipartite(graph)
    if is_bip:
        print("该图是二分图")
        print("染色结果:", coloring)
    else:
        print("该图不是二分图")
