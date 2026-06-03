#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>
using namespace std;

vector<int> aStar(const vector<int>& grid, int start, int end) {
    int n = grid.size();
    auto h = [&](int pos) { return abs(end - pos); };

    // (f, g, pos)
    using Node = tuple<int, int, int>;
    priority_queue<Node, vector<Node>, greater<Node>> open;
    unordered_map<int, int> gScore, parent;
    unordered_set<int> closed;

    open.push({h(start), 0, start});
    gScore[start] = 0;
    parent[start] = -1;

    while (!open.empty()) {
        auto [f, g, cur] = open.top(); open.pop();
        if (closed.count(cur)) continue;
        closed.insert(cur);

        if (cur == end) {
            vector<int> path;
            while (cur != -1) {
                path.push_back(cur);
                cur = parent[cur];
            }
            reverse(path.begin(), path.end());
            return path;
        }

        for (int nxt : {cur - 1, cur + 1}) {
            if (nxt >= 0 && nxt < n && grid[nxt] == 0 &&
                !closed.count(nxt)) {
                int tentG = g + 1;
                if (!gScore.count(nxt) || tentG < gScore[nxt]) {
                    gScore[nxt] = tentG;
                    parent[nxt] = cur;
                    open.push({tentG + h(nxt), tentG, nxt});
                }
            }
        }
    }
    return {};
}
