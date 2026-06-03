def matrix_chain_order(dims):
    # dims = [p0, p1, ..., pn]，共 n 个矩阵，Ai 维度为 pi-1 x pi
    n = len(dims) - 1
    dp = [[0] * n for _ in range(n)]       # dp[i][j] = min cost for Ai..Aj
    split = [[0] * n for _ in range(n)]    # 最优分割点

    for length in range(2, n + 1):         # 区间长度
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
                if cost < dp[i][j]:
                    dp[i][j] = cost
                    split[i][j] = k

    return dp[0][n - 1], split
