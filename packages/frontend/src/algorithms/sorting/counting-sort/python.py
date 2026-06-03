def counting_sort(arr):
    if not arr:
        return arr

    max_val = max(arr)
    count = [0] * (max_val + 1)

    for v in arr:
        count[v] += 1

    for i in range(1, len(count)):
        count[i] += count[i - 1]

    output = [0] * len(arr)
    for v in reversed(arr):
        count[v] -= 1
        output[count[v]] = v

    return output
