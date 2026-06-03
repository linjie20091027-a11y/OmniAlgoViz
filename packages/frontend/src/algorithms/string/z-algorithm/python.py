def z_algorithm(s: str):
    n = len(s)
    z = [0] * n
    l = r = 0

    for i in range(1, n):
        # 在 Z-box 内复用
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        # 朴素扩展
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        # 更新 Z-box
        if i + z[i] - 1 > r:
            l, r = i, i + z[i] - 1

    return z
