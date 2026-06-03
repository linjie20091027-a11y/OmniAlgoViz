# Miller-Rabin 素性测试
# 时间复杂度 O(k log³ n)，空间复杂度 O(1)
# 概率算法，k 轮测试后错误概率 < (1/4)^k

import random


def mod_pow(base: int, exp: int, mod: int) -> int:
    """快速幂取模"""
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1
    return result


def miller_rabin_test(n: int, k: int = 5) -> bool:
    """
    Miller-Rabin 素性测试
    n: 待测数 (n > 2, n 为奇数)
    k: 测试轮数，越大越可靠
    返回 True 表示 n 很可能为素数
    """
    if n < 2:
        return False
    if n == 2 or n == 3:
        return True
    if n % 2 == 0:
        return False

    # 步骤 1：分解 n-1 = d × 2^s
    d = n - 1
    s = 0
    while d % 2 == 0:
        d //= 2
        s += 1

    # 步骤 2：进行 k 轮测试
    for _ in range(k):
        a = random.randint(2, n - 2)   # 随机选底数
        x = mod_pow(a, d, n)            # 计算 a^d mod n

        if x == 1 or x == n - 1:
            continue                    # 本轮通过

        # 持续平方检查
        for _ in range(s - 1):
            x = mod_pow(x, 2, n)
            if x == n - 1:
                break                   # 通过
        else:
            return False                # 合数，底数 a 是见证者

    return True                         # 很可能为素数


if __name__ == '__main__':
    n = int(input("请输入待测整数 n: "))
    k = int(input("请输入测试轮数 k (默认 5): ") or 5)

    if miller_rabin_test(n, k):
        print(f"{n} 极大概率为素数（已通过 {k} 轮测试）")
    else:
        print(f"{n} 是合数")
