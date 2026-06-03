def tarjan_scc(graph):
    n = len(graph)
    index = 0
    indices = [-1] * n
    lowlink = [-1] * n
    on_stack = [False] * n
    stack = []
    scc_list = []

    def strongconnect(v):
        nonlocal index
        indices[v] = lowlink[v] = index
        index += 1
        stack.append(v)
        on_stack[v] = True

        for w in graph[v]:
            if indices[w] == -1:
                strongconnect(w)
                lowlink[v] = min(lowlink[v], lowlink[w])
            elif on_stack[w]:
                lowlink[v] = min(lowlink[v], indices[w])

        if lowlink[v] == indices[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            scc_list.append(scc)

    for i in range(n):
        if indices[i] == -1:
            strongconnect(i)

    return scc_list


if __name__ == '__main__':
    graph = [
        [1],
        [2, 4],
        [3, 0],
        [5],
        [5],
        [4],
    ]
    sccs = tarjan_scc(graph)
    print("强连通分量:", sccs)
