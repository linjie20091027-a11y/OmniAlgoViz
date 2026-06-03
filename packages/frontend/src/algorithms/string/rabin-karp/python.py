def rabin_karp(text: str, pattern: str):
    n, m = len(text), len(pattern)
    BASE = 31
    MOD = 10 ** 9 + 7

    # 计算模式串哈希
    pattern_hash = 0
    for ch in pattern:
        pattern_hash = (pattern_hash * BASE + ord(ch) - 96) % MOD

    # 预计算 BASE^(m-1)
    high_pow = pow(BASE, m - 1, MOD)

    # 滚动哈希搜索
    window_hash = 0
    result = []
    for i in range(n):
        # 加入新字符
        window_hash = (window_hash * BASE + ord(text[i]) - 96) % MOD
        # 移出旧字符
        if i >= m:
            window_hash = (window_hash - (ord(text[i - m]) - 96) * high_pow) % MOD

        if i >= m - 1 and window_hash == pattern_hash:
            # 二次确认
            if text[i - m + 1:i + 1] == pattern:
                result.append(i - m + 1)
    return result
