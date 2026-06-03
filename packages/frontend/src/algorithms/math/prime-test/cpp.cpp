// Miller-Rabin 素性测试
// 时间复杂度 O(k log³ n)，空间复杂度 O(1)
// 概率算法，k 轮测试后错误概率 < (1/4)^k

#include <iostream>
#include <cstdlib>
#include <ctime>
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

bool millerRabinTest(long long n, int k = 5) {
    // Miller-Rabin 素性测试
    // n: 待测数 (n > 2, n 为奇数)
    // k: 测试轮数，越大越可靠
    if (n < 2) return false;
    if (n == 2 || n == 3) return true;
    if (n % 2 == 0) return false;

    // 步骤 1：分解 n-1 = d × 2^s
    long long d = n - 1;
    int s = 0;
    while (d % 2 == 0) {
        d /= 2;
        ++s;
    }

    // 步骤 2：进行 k 轮测试
    for (int i = 0; i < k; ++i) {
        long long a = 2 + rand() % (n - 3);  // 随机选底数 [2, n-2]
        long long x = modPow(a, d, n);        // 计算 a^d mod n

        if (x == 1 || x == n - 1)
            continue;  // 本轮通过

        // 持续平方检查
        bool pass = false;
        for (int j = 0; j < s - 1; ++j) {
            x = modPow(x, 2, n);
            if (x == n - 1) {
                pass = true;
                break;
            }
        }
        if (!pass) return false;  // 合数
    }
    return true;  // 很可能为素数
}

int main() {
    srand(time(0));

    long long n;
    int k;
    cout << "请输入待测整数 n: ";
    cin >> n;
    cout << "请输入测试轮数 k (默认 5): ";
    cin >> k;

    if (millerRabinTest(n, k))
        cout << n << " 极大概率为素数（已通过 " << k << " 轮测试）" << endl;
    else
        cout << n << " 是合数" << endl;
    return 0;
}
