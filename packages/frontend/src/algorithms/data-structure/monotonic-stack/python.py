def next_greater_element(arr: list[int]) -> list[int]:
    n = len(arr)
    result = [-1] * n
    stack = []  # 单调递减栈，存储索引

    for i in range(n):
        while stack and arr[stack[-1]] < arr[i]:
            popped = stack.pop()
            result[popped] = arr[i]
        stack.append(i)

    return result


# 示例
if __name__ == "__main__":
    nums = [2, 1, 2, 4, 3]
    print(next_greater_element(nums))  # [4, 2, 4, -1, -1]
