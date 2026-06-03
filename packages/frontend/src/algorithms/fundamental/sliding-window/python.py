def sliding_window(arr, k):
    n = len(arr)
    ws = sum(arr[:k])
    mx = ws
    for i in range(k, n):
        ws = ws - arr[i - k] + arr[i]
        mx = max(mx, ws)
    return mx
