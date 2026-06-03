def stone_merge(stones):
    # 线性石子合并，每次合并相邻两堆，代价为两堆之和，求最小总代价
    n = len(stones)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]

    dp = [[0] * n for _ in range(n)]  # dp[i][j] = 合并区间 [i, j] 的最小代价

    for length in range(2, n + 1):    # 区间长度
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            total = prefix[j + 1] - prefix[i]  # 区间总石子数
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + total
                if cost < dp[i][j]:
                    dp[i][j] = cost

    return dp[0][n - 1]
