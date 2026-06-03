#include <string>
#include <vector>
using namespace std;

string manacher(const string& s) {
    // 预处理
    string t = "#";
    for (char c : s) { t += c; t += '#'; }

    int n = t.size();
    vector<int> p(n);
    int c = 0, r = 0;

    for (int i = 0; i < n; i++) {
        if (i < r) p[i] = min(r - i, p[2 * c - i]);
        // 中心扩展
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n &&
               t[i - p[i] - 1] == t[i + p[i] + 1]) p[i]++;
        if (i + p[i] > r) { c = i; r = i + p[i] }
    }

    // 找最长回文
    int center = 0, maxLen = 0;
    for (int i = 0; i < n; i++) {
        if (p[i] > maxLen) { maxLen = p[i]; center = i; }
    }
    int start = (center - maxLen) / 2;
    return s.substr(start, maxLen);
}
