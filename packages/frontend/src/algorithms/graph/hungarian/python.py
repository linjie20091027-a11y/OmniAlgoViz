def hungarian(adj, left_size):
    matchR = [-1] * (max(max(row, default=-1) for row in adj) + 1)

    def dfs(u, visited):
        for v in adj[u]:
            if visited[v]:
                continue
            visited[v] = True
            if matchR[v] == -1 or dfs(matchR[v], visited):
                matchR[v] = u
                return True
        return False

    total_match = 0
    for u in range(left_size):
        visited = [False] * len(matchR)
        if dfs(u, visited):
            total_match += 1

    matchL = [-1] * left_size
    for v, u in enumerate(matchR):
        if u != -1:
            matchL[u] = v

    return total_match, matchL, matchR


if __name__ == '__main__':
    adj = [
        [0, 1],
        [0, 2],
        [1],
        [2, 3],
    ]
    total, matchL, matchR = hungarian(adj, 4)
    print("最大匹配数:", total)
    print("左→右匹配:", matchL)
    print("右→左匹配:", matchR)
