def manacher(s: str) -> str:
    # 预处理字符串
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    p = [0] * n
    c = r = 0

    for i in range(n):
        # 利用对称性
        if i < r:
            p[i] = min(r - i, p[2 * c - i])
        # 中心扩展
        while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and t[i - p[i] - 1] == t[i + p[i] + 1]:
            p[i] += 1
        # 更新最右回文边界
        if i + p[i] > r:
            c, r = i, i + p[i]

    # 找到最长回文
    max_len, center = max((p[i], i) for i in range(n))
    start = (center - max_len) // 2
    return s[start:start + max_len]
