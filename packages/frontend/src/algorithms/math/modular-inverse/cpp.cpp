// 乘法逆元（费马小定理 / 扩展欧几里得）
// 时间复杂度 O(log mod)，空间复杂度 O(1)

#include <iostream>
#include <tuple>
using namespace std;

long long modPow(long long base, long long exp, long long mod) {
    // 快速幂取模
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1)
            result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return result;
}

long long modInverseFermat(long long a, long long p) {
    // 费马小定理求乘法逆元：a^(p-2) mod p（要求 p 为素数）
    return modPow(a, p - 2, p);
}

tuple<long long, long long, long long> extendedGcd(long long a, long long b) {
    // 扩展欧几里得：返回 (gcd, x, y) 使得 a*x + b*y = gcd
    if (b == 0) return {a, 1, 0};
    auto [d, x1, y1] = extendedGcd(b, a % b);
    return {d, y1, x1 - (a / b) * y1};
}

long long modInverse(long long a, long long m) {
    // 扩展欧几里得求逆元（适用于任意互质的 a 和 m）
    auto [d, x, y] = extendedGcd(a, m);
    return (x % m + m) % m;
}

int main() {
    long long a, p;
    cout << "请输入整数 a: ";
    cin >> a;
    cout << "请输入模数 p (素数): ";
    cin >> p;

    long long inv = modInverseFermat(a, p);
    cout << a << " 在模 " << p << " 下的逆元为 " << inv << endl;
    cout << "验证: " << a << " × " << inv << " mod " << p
         << " = " << (a * inv) % p << endl;
    return 0;
}
