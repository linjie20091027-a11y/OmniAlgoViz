# 中国剩余定理 (Chinese Remainder Theorem)
# 时间复杂度 O(n log M)，空间复杂度 O(n)

def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """扩展欧几里得"""
    if b == 0:
        return a, 1, 0
    d, x1, y1 = extended_gcd(b, a % b)
    return d, y1, x1 - (a // b) * y1


def mod_inverse(a: int, m: int) -> int:
    """求 a 在模 m 下的逆元"""
    d, x, y = extended_gcd(a, m)
    return (x % m + m) % m


def crt(remainders: list[int], moduli: list[int]) -> int:
    """
    中国剩余定理求解 x：
    x ≡ remainders[i] (mod moduli[i])  for all i
    要求所有 moduli 两两互质
    """
    n = len(remainders)
    # 步骤 1：计算 M = 所有模数之积
    M = 1
    for m in moduli:
        M *= m

    # 步骤 2：计算各自的 M_i 和逆元
    result = 0
    for i in range(n):
        Mi = M // moduli[i]           # M_i = M / m_i
        inv = mod_inverse(Mi, moduli[i])  # M_i 在模 m_i 下的逆元
        result += remainders[i] * Mi * inv

    return result % M                 # 取模得最终解


if __name__ == '__main__':
    # 示例：x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7)
    r = [2, 3, 2]
    m = [3, 5, 7]
    x = crt(r, m)
    print(f"同余方程组: {list(zip(r, m))}")
    print(f"解为 x = {x}")
    for i in range(len(r)):
        print(f"  验证: {x} mod {m[i]} = {x % m[i]} (期望 {r[i]})")
