import bisect

def lis(arr):
    n = len(arr)
    dp = [1] * n  # dp[i] = 以 arr[i] 结尾的最长上升子序列长度
    tails = []    # tails[i] = 长度为 i+1 的上升子序列的最小结尾值

    for i, x in enumerate(arr):
        # 在 tails 中二分查找 x 的插入位置
        pos = bisect.bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
        dp[i] = pos + 1

    length = len(tails)
    # 回溯构造一个 LIS
    lis_result = []
    need = length
    for i in range(n - 1, -1, -1):
        if dp[i] == need:
            lis_result.append(arr[i])
            need -= 1

    return length, lis_result[::-1]
