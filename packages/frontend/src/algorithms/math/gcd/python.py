# 欧几里得算法（辗转相除法）
# 时间复杂度 O(log min(a,b))，空间复杂度 O(1)

def gcd(a: int, b: int) -> int:
    """返回 a 和 b 的最大公约数"""
    while b != 0:
        a, b = b, a % b
    return a


def gcd_recursive(a: int, b: int) -> int:
    """递归版欧几里得算法"""
    if b == 0:
        return a
    return gcd_recursive(b, a % b)


if __name__ == '__main__':
    a = int(input("请输入整数 a: "))
    b = int(input("请输入整数 b: "))
    print(f"gcd({a}, {b}) = {gcd(a, b)}")
