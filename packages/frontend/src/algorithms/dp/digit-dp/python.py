def digit_dp_count(n):
    """
    数位DP：统计 [0, n] 中不包含数字 4 的数的个数
    """
    digits = list(map(int, str(n)))
    m = len(digits)

    # dp[pos][tight] = 从第 pos 位开始，tight 表示是否受限的合法方案数
    from functools import lru_cache

    @lru_cache(None)
    def dfs(pos, tight, started):
        if pos == m:
            return 1 if started else 0  # 空数不计

        limit = digits[pos] if tight else 9
        total = 0
        for d in range(limit + 1):
            if d == 4:
                continue  # 跳过含 4 的数字
            next_tight = tight and (d == limit)
            next_started = started or (d != 0)
            total += dfs(pos + 1, next_tight, next_started)
        return total

    return dfs(0, True, False)
