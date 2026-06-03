// 快速乘 / 俄罗斯农民乘法 (Russian Peasant Multiplication)
// 时间复杂度 O(log b)，空间复杂度 O(1)
// 仅用加法实现乘法，避免大数溢出

#include <iostream>
using namespace std;

long long quickMul(long long a, long long b) {
    // 俄罗斯农民乘法：计算 a × b，只使用加法
    // 原理：利用二进制展开 b，累加对应位的 a
    long long result = 0;
    while (b > 0) {
        if (b & 1)               // b 的当前二进制位为 1
            result += a;         // 累加
        a <<= 1;                 // a 翻倍（乘 2）
        b >>= 1;                 // b 减半（除 2）
    }
    return result;
}

long long quickMulMod(long long a, long long b, long long mod) {
    // 带取模的快速乘：计算 (a × b) % mod，避免溢出
    long long result = 0;
    a %= mod;
    while (b > 0) {
        if (b & 1)
            result = (result + a) % mod;
        a = (a << 1) % mod;
        b >>= 1;
    }
    return result;
}

int main() {
    long long a, b;
    cout << "请输入乘数 a: ";
    cin >> a;
    cout << "请输入乘数 b: ";
    cin >> b;

    cout << a << " × " << b << " = " << quickMul(a, b) << endl;
    cout << "验证（直接乘法）: " << a * b << endl;
    return 0;
}
