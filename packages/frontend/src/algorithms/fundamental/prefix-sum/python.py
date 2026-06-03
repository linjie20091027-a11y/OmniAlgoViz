def prefix_sum(arr):
    n = len(arr)
    pf = [0] * n
    pf[0] = arr[0]
    for i in range(1, n):
        pf[i] = pf[i - 1] + arr[i]
    return pf

def range_query(pf, l, r):
    if l == 0:
        return pf[r]
    return pf[r] - pf[l - 1]
