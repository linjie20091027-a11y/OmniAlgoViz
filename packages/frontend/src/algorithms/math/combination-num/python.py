# 组合数 / 杨辉三角 (Pascal's Triangle)
# 时间复杂度 O(n²)，空间复杂度 O(n²) 或 O(n)
# C(n,k) = C(n-1,k-1) + C(n-1,k)

def pascal_triangle(n: int) -> list[list[int]]:
    """
    生成杨辉三角前 n 行
    triangle[i][j] = C(i, j) = 二项式系数
    """
    triangle = [[1]]                   # 第 0 行

    for i in range(1, n):
        row = [1]                      # 每行开头是 1
        prev = triangle[i - 1]

        for j in range(1, i):
            # C(i, j) = C(i-1, j-1) + C(i-1, j)
            row.append(prev[j - 1] + prev[j])

        row.append(1)                  # 每行结尾是 1
        triangle.append(row)

    return triangle


def combination(n: int, k: int) -> int:
    """
    计算单个组合数 C(n, k)，使用递推公式
    空间优化：只保留一行
    """
    if k < 0 or k > n:
        return 0

    row = [1]                          # 初始行
    for i in range(1, n + 1):
        # 从后往前更新，避免覆盖
        new_row = [1]
        for j in range(1, i):
            new_row.append(row[j - 1] + row[j])
        new_row.append(1)
        row = new_row

    return row[k]


if __name__ == '__main__':
    n = int(input("请输入行数 n: "))
    triangle = pascal_triangle(n)

    print("杨辉三角（组合数表）：")
    for i, row in enumerate(triangle):
        print(f"  第 {i} 行: {row}")

    print(f"\n示例：C(5,2) = {combination(5, 2)}")
