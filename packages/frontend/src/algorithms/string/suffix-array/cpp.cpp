#include <string>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> suffixArray(string s) {
    int n = s.size();
    vector<int> rk(n), sa(n), tmp(n);

    for (int i = 0; i < n; i++) { rk[i] = s[i] - 'a' + 1; sa[i] = i; }

    for (int w = 1; w < 2 * n; w <<= 1) {
        sort(sa.begin(), sa.end(), [&](int a, int b) {
            if (rk[a] != rk[b]) return rk[a] < rk[b];
            int ra = (a + w < n) ? rk[a + w] : -1;
            int rb = (b + w < n) ? rk[b + w] : -1;
            return ra < rb;
        });

        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++) {
            tmp[sa[i]] = tmp[sa[i - 1]] + (
                (rk[sa[i]] != rk[sa[i - 1]]) ||
                ((sa[i] + w < n ? rk[sa[i] + w] : -1) != (sa[i - 1] + w < n ? rk[sa[i - 1] + w] : -1))
            );
        }
        rk = tmp;
        if (rk[sa[n - 1]] == n - 1) break;
    }
    return sa;
}
