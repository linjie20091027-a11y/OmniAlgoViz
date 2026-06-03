#include <string>
#include <vector>
#include <cstring>
using namespace std;

int memo[10][2][2];

int dfs(const string& s, int pos, bool tight, bool started) {
    if (pos == s.size()) return started ? 1 : 0;
    if (memo[pos][tight][started] != -1)
        return memo[pos][tight][started];

    int limit = tight ? s[pos] - '0' : 9;
    int total = 0;
    for (int d = 0; d <= limit; d++) {
        if (d == 4) continue;
        bool nextTight = tight && (d == limit);
        bool nextStarted = started || (d != 0);
        total += dfs(s, pos + 1, nextTight, nextStarted);
    }
    return memo[pos][tight][started] = total;
}

int digitDpCount(int n) {
    string s = to_string(n);
    memset(memo, -1, sizeof(memo));
    return dfs(s, 0, true, false);
}
