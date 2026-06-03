#include <string>
#include <vector>
using namespace std;
using ll = long long;

struct StringHash {
    ll base, mod;
    vector<ll> hash, pow;

    StringHash(const string& s, ll b = 131, ll m = 1000000007)
        : base(b), mod(m) {
        int n = s.size();
        hash.resize(n + 1);
        pow.resize(n + 1, 1);
        for (int i = 0; i < n; i++) {
            hash[i + 1] = (hash[i] * base + s[i] - 'a' + 1) % mod;
            pow[i + 1] = (pow[i] * base) % mod;
        }
    }

    // 获取子串 s[l..r] 的哈希值 (闭区间)
    ll getHash(int l, int r) {
        return (hash[r + 1] - hash[l] * pow[r - l + 1] % mod + mod) % mod;
    }
};
