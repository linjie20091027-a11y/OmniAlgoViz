# 卡特兰数 (Catalan Numbers)
# 时间复杂度 O(n²)，空间复杂度 O(n)
# 应用：括号匹配、出栈序列、二叉树计数等

def catalan(n: int) -> list[int]:
    """
    动态规划计算卡特兰数列 C[0..n]
    递推公式：C[0] = 1, C[n] = Σ C[i] × C[n-1-i]  (i = 0..n-1)
    """
    C = [0] * (n + 1)
    C[0] = 1                         # 空序列只有一种方案

    for i in range(1, n + 1):
        total = 0
        for j in range(i):
            total += C[j] * C[i - 1 - j]
        C[i] = total

    return C


if __name__ == '__main__':
    n = int(input("请输入 n: "))
    cats = catalan(n)
    for i, val in enumerate(cats):
        print(f"C{i} = {val}")
    print(f"\n卡特兰数的应用示例：")
    print(f"  C{n} = 合法括号序列数（{n} 对括号）")
    print(f"  C{n} = {n} 个节点的不同二叉树数量")
