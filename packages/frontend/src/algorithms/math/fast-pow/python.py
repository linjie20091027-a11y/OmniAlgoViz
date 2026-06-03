# 快速幂（二分幂 / 快速幂取模）
# 时间复杂度 O(log n)，空间复杂度 O(1)

def fast_pow(base: int, exp: int) -> int:
    """计算 base^exp，时间复杂度 O(log exp)"""
    result = 1
    while exp > 0:
        if exp & 1:          # 如果当前二进制位为 1
            result *= base
        base *= base          # 底数平方
        exp >>= 1             # 指数右移一位
    return result


def mod_pow(base: int, exp: int, mod: int) -> int:
    """带取模的快速幂：计算 (base^exp) % mod"""
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1
    return result


if __name__ == '__main__':
    base = int(input("请输入底数: "))
    exp = int(input("请输入指数: "))
    print(f"{base}^{exp} = {fast_pow(base, exp)}")
