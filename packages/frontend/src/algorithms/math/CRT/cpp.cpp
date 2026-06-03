// 中国剩余定理 (Chinese Remainder Theorem)
// 时间复杂度 O(n log M)，空间复杂度 O(n)

#include <iostream>
#include <vector>
#include <tuple>
using namespace std;

tuple<long long, long long, long long> extendedGcd(long long a, long long b) {
    // 扩展欧几里得
    if (b == 0) return {a, 1, 0};
    auto [d, x1, y1] = extendedGcd(b, a % b);
    return {d, y1, x1 - (a / b) * y1};
}

long long modInverse(long long a, long long m) {
    // 求 a 在模 m 下的逆元
    auto [d, x, y] = extendedGcd(a, m);
    return (x % m + m) % m;
}

long long crt(const vector<long long>& remainders,
              const vector<long long>& moduli) {
    // 中国剩余定理求解 x：x ≡ remainders[i] (mod moduli[i])
    // 要求所有 moduli 两两互质
    int n = remainders.size();

    // 步骤 1：计算 M = 所有模数之积
    long long M = 1;
    for (long long m : moduli) M *= m;

    // 步骤 2：计算各自的 M_i 和逆元
    long long result = 0;
    for (int i = 0; i < n; ++i) {
        long long Mi = M / moduli[i];              // M_i = M / m_i
        long long inv = modInverse(Mi, moduli[i]);  // M_i 在模 m_i 下的逆元
        result += remainders[i] * Mi * inv;
    }

    return result % M;  // 取模得最终解
}

int main() {
    vector<long long> r = {2, 3, 2};  // 余数
    vector<long long> m = {3, 5, 7};  // 模数

    long long x = crt(r, m);
    cout << "同余方程组: ";
    for (size_t i = 0; i < r.size(); ++i)
        cout << "x≡" << r[i] << "(mod " << m[i] << ") ";
    cout << endl;
    cout << "解为 x = " << x << endl;

    for (size_t i = 0; i < r.size(); ++i)
        cout << "  验证: " << x << " mod " << m[i]
             << " = " << x % m[i] << " (期望 " << r[i] << ")" << endl;
    return 0;
}
