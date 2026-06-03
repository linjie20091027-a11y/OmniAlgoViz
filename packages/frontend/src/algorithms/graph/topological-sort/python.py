from collections import deque


def topological_sort(graph):
    n = len(graph)
    indegree = [0] * n
    for u in range(n):
        for v in graph[u]:
            indegree[v] += 1

    queue = deque([i for i in range(n) if indegree[i] == 0])
    result = []

    while queue:
        u = queue.popleft()
        result.append(u)
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)

    if len(result) < n:
        print("图中存在环！")
        return None

    return result


if __name__ == '__main__':
    graph = [
        [1, 2],
        [3, 4],
        [3],
        [5],
        [5],
        [],
    ]
    result = topological_sort(graph)
    if result:
        print("拓扑排序结果:", result)
