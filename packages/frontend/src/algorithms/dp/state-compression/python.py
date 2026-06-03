def tsp(dist):
    """
    状压DP求解TSP：dist[i][j] 为城市 i 到 j 的距离
    dp[mask][i] = 从 0 出发，经过 mask 中的城市（bit 表示），
                  当前在城市 i 的最短路径长度
    """
    n = len(dist)
    INF = float('inf')
    # dp[mask][i]
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0  # 从城市 0 出发

    for mask in range(1 << n):
        if mask & 1 == 0:
            continue  # 必须包含起点 0
        for i in range(n):
            if not (mask & (1 << i)) or dp[mask][i] == INF:
                continue
            for j in range(n):
                if mask & (1 << j):
                    continue  # j 已经访问过
                new_mask = mask | (1 << j)
                dp[new_mask][j] = min(dp[new_mask][j], dp[mask][i] + dist[i][j])

    # 回到起点
    full_mask = (1 << n) - 1
    best = INF
    for i in range(1, n):
        best = min(best, dp[full_mask][i] + dist[i][0])

    return best
