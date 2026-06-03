# 埃氏筛法 (Sieve of Eratosthenes)
# 时间复杂度 O(n log log n)，空间复杂度 O(n)

def sieve(n: int) -> list[int]:
    """返回 [0, n] 内的所有素数列表"""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False

    for p in range(2, int(n ** 0.5) + 1):
        if is_prime[p]:
            # 从 p*p 开始筛，因为更小的倍数已被筛过
            for multiple in range(p * p, n + 1, p):
                is_prime[multiple] = False

    return [i for i in range(n + 1) if is_prime[i]]


if __name__ == '__main__':
    n = int(input("请输入 n: "))
    primes = sieve(n)
    print(f"1~{n} 内的素数 ({len(primes)} 个): {primes}")
