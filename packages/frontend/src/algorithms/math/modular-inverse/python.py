# 乘法逆元（费马小定理 / 扩展欧几里得）
# 时间复杂度 O(log mod)，空间复杂度 O(1)

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


def mod_inverse_fermat(a: int, p: int) -> int:
    """费马小定理求乘法逆元：a^(p-2) mod p（要求 p 为素数）"""
    return mod_pow(a, p - 2, p)


def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """扩展欧几里得：返回 (gcd, x, y) 使得 a*x + b*y = gcd"""
    if b == 0:
        return a, 1, 0
    d, x1, y1 = extended_gcd(b, a % b)
    return d, y1, x1 - (a // b) * y1


def mod_inverse(a: int, m: int) -> int:
    """扩展欧几里得求逆元（适用于任意互质的 a 和 m）"""
    d, x, y = extended_gcd(a, m)
    # 确保 x 为非负
    return (x % m + m) % m


if __name__ == '__main__':
    a = int(input("请输入整数 a: "))
    p = int(input("请输入模数 p (素数): "))
    inv = mod_inverse_fermat(a, p)
    print(f"{a} 在模 {p} 下的逆元为 {inv}")
    print(f"验证: {a} × {inv} mod {p} = {(a * inv) % p}")
