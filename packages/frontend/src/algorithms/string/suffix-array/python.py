def suffix_array(s: str):
    n = len(s)
    # 初始排名：以 ASCII 为初始 rank
    rk = [ord(c) - 96 for c in s]
    sa = list(range(n))
    tmp = [0] * n

    w = 1
    while w < 2 * n:
        # 按 (rk[i], rk[i+w]) 双关键字排序
        sa.sort(key=lambda x: (rk[x], rk[x + w] if x + w < n else -1))
        # 离散化
        tmp[sa[0]] = 0
        for i in range(1, n):
            tmp[sa[i]] = tmp[sa[i - 1]] + (
                1 if (rk[sa[i]] != rk[sa[i - 1]] or
                      (sa[i] + w < n and sa[i - 1] + w < n and rk[sa[i] + w] != rk[sa[i - 1] + w]) or
                      (sa[i] + w < n) != (sa[i - 1] + w < n)) else 0
            )
        rk = tmp[:]
        if rk[sa[n - 1]] == n - 1:
            break
        w <<= 1

    return sa
