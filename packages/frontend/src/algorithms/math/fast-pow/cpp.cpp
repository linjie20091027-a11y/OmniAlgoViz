// 快速幂（二分幂 / 快速幂取模）
// 时间复杂度 O(log n)，空间复杂度 O(1)

#include <iostream>
using namespace std;

long long fastPow(long long base, long long exp) {
    // 计算 base^exp，时间复杂度 O(log exp)
    long long result = 1;
    while (exp > 0) {
        if (exp & 1)           // 如果当前二进制位为 1
            result *= base;
        base *= base;           // 底数平方
        exp >>= 1;              // 指数右移一位
    }
    return result;
}

long long modPow(long long base, long long exp, long long mod) {
    // 带取模的快速幂：计算 (base^exp) % mod
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

int main() {
    long long base, exp;
    cout << "请输入底数: ";
    cin >> base;
    cout << "请输入指数: ";
    cin >> exp;

    cout << base << "^" << exp << " = " << fastPow(base, exp) << endl;
    return 0;
}
