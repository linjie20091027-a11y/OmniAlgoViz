def minimum_notation(s: str):
    n = len(s)
    t = s + s
    i, j, k = 0, 1, 0

    while i < n and j < n and k < n:
        if t[i + k] == t[j + k]:
            k += 1
        elif t[i + k] > t[j + k]:
            i += k + 1
            if i <= j:
                i = j + 1
            k = 0
        else:
            j += k + 1
            if j <= i:
                j = i + 1
            k = 0

    start = min(i, j)
    return s[start:] + s[:start]
