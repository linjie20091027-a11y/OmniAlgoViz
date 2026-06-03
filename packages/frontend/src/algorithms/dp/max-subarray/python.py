def max_subarray(arr):
    cur = arr[0]        # 以当前位置结尾的最大子数组和
    best = arr[0]       # 全局最大子数组和
    start = end = 0     # 全局最优区间
    cur_start = 0       # 当前区间起点

    for i in range(1, len(arr)):
        if cur + arr[i] > arr[i]:
            cur = cur + arr[i]
        else:
            cur = arr[i]
            cur_start = i

        if cur > best:
            best = cur
            start = cur_start
            end = i

    return best, start, end
