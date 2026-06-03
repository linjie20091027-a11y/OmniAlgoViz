#include <vector>
#include <queue>
#include <unordered_set>
#include <unordered_map>
using namespace std;

vector<int> bidirectionalBfs(const vector<int>& grid, int start, int end) {
    if (start == end) return {start};
    int n = grid.size();

    queue<int> qf, qb;
    unordered_set<int> vf, vb;
    unordered_map<int, int> pf, pb;

    qf.push(start); vb.insert(start); pf[start] = -1;
    qb.push(end);   vb.insert(end);   pb[end] = -1;

    auto expand = [&](queue<int>& q, unordered_set<int>& vis,
                      unordered_set<int>& other,
                      unordered_map<int, int>& par) -> int {
        int cur = q.front(); q.pop();
        for (int nxt : {cur - 1, cur + 1}) {
            if (nxt >= 0 && nxt < n && grid[nxt] == 0 && !vis.count(nxt)) {
                vis.insert(nxt);
                par[nxt] = cur;
                q.push(nxt);
                if (other.count(nxt)) return nxt;
            }
        }
        return -1;
    };

    while (!qf.empty() && !qb.empty()) {
        int meet = expand(qf, vf, vb, pf);
        if (meet >= 0) {
            vector<int> path;
            for (int cur = meet; cur != -1; cur = pf[cur]) path.push_back(cur);
            reverse(path.begin(), path.end());
            for (int cur = pb[meet]; cur != -1; cur = pb[cur]) path.push_back(cur);
            return path;
        }
        meet = expand(qb, vb, vf, pb);
        if (meet >= 0) {
            vector<int> path;
            for (int cur = meet; cur != -1; cur = pf[cur]) path.push_back(cur);
            reverse(path.begin(), path.end());
            for (int cur = pb[meet]; cur != -1; cur = pb[cur]) path.push_back(cur);
            return path;
        }
    }
    return {};
}
