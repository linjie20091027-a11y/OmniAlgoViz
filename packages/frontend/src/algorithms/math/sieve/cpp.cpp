// 埃氏筛法 (Sieve of Eratosthenes)
// 时间复杂度 O(n log log n)，空间复杂度 O(n)

#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

vector<int> sieve(int n) {
    // 返回 [0, n] 内的所有素数列表
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;

    for (int p = 2; p * p <= n; ++p) {
        if (isPrime[p]) {
            // 从 p*p 开始筛，因为更小的倍数已被筛过
            for (int multiple = p * p; multiple <= n; multiple += p) {
                isPrime[multiple] = false;
            }
        }
    }

    vector<int> primes;
    for (int i = 2; i <= n; ++i) {
        if (isPrime[i]) primes.push_back(i);
    }
    return primes;
}

int main() {
    int n;
    cout << "请输入 n: ";
    cin >> n;

    vector<int> primes = sieve(n);
    cout << "1~" << n << " 内的素数 (" << primes.size() << " 个): ";
    for (int p : primes) cout << p << " ";
    cout << endl;
    return 0;
}
