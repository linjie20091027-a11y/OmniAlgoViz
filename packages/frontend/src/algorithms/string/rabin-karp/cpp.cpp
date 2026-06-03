#include <string>
#include <vector>
using namespace std;
using ll = long long;

vector<int> rabinKarp(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    const ll BASE = 31, MOD = 1000000007;
    vector<int> result;

    // 模式串哈希
    ll patternHash = 0;
    for (char ch : pattern)
        patternHash = (patternHash * BASE + ch - 96) % MOD;

    // 预计算 BASE^(m-1)
    ll highPow = 1;
    for (int i = 0; i < m - 1; i++)
        highPow = (highPow * BASE) % MOD;

    // 滚动哈希
    ll windowHash = 0;
    for (int i = 0; i < n; i++) {
        windowHash = (windowHash * BASE + text[i] - 96) % MOD;
        if (i >= m)
            windowHash = (windowHash - (text[i - m] - 96) * highPow % MOD + MOD) % MOD;

        if (i >= m - 1 && windowHash == patternHash) {
            // 二次确认
            if (text.substr(i - m + 1, m) == pattern)
                result.push_back(i - m + 1);
        }
    }
    return result;
}
