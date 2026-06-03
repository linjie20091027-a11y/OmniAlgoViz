def ternary_search(arr):
    left, right = 0, len(arr) - 1
    while right - left > 2:
        mid1 = left + (right - left) // 3
        mid2 = right - (right - left) // 3
        if arr[mid1] < arr[mid2]:
            left = mid1 + 1
        else:
            right = mid2 - 1
    return max(range(left, right + 1), key=lambda i: arr[i])
