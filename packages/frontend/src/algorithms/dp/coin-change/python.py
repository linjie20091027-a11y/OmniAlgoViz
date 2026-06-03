def coin_change(coins, amount):
    # dp[i] = 凑出金额 i 所需的最少硬币数
    INF = float('inf')
    dp = [0] + [INF] * amount
    # choice[i] = 凑出金额 i 时最后选择的面值
    choice = [0] * (amount + 1)

    for c in coins:
        for i in range(c, amount + 1):
            if dp[i - c] + 1 < dp[i]:
                dp[i] = dp[i - c] + 1
                choice[i] = c

    if dp[amount] == INF:
        return -1, []

    # 回溯构造方案
    result = []
    remain = amount
    while remain > 0:
        result.append(choice[remain])
        remain -= choice[remain]

    return dp[amount], result
