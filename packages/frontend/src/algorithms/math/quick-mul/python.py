# 快速乘 / 俄罗斯农民乘法 (Russian Peasant Multiplication)
# 时间复杂度 O(log b)，空间复杂度 O(1)
# 仅用加法实现乘法，避免大数溢出

def quick_mul(a: int, b: int) -> int:
    """
    俄罗斯农民乘法：计算 a × b，只使用加法
    原理：利用二进制展开 b，累加对应位的 a
    """
    result = 0
    while b > 0:
        if b & 1:              # b 的当前二进制位为 1
            result += a        # 累加
        a <<= 1                 # a 翻倍（乘 2）
        b >>= 1                 # b 减半（除 2）
    return result


def quick_mul_mod(a: int, b: int, mod: int) -> int:
    """带取模的快速乘：计算 (a × b) % mod，避免溢出"""
    result = 0
    a %= mod
    while b > 0:
        if b & 1:
            result = (result + a) % mod
        a = (a << 1) % mod
        b >>= 1
    return result


if __name__ == '__main__':
    a = int(input("请输入乘数 a: "))
    b = int(input("请输入乘数 b: "))
    print(f"{a} × {b} = {quick_mul(a, b)}")
    print(f"验证（直接乘法）: {a * b}")
