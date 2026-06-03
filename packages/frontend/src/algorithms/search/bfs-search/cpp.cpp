#include <vector>
#include <queue>
#include <unordered_set>
#include <unordered_map>
using namespace std;

vector<int> bfsSearch(const vector<int>& grid, int start, int end) {
    int n = grid.size();
    queue<int> q;
    unordered_set<int> visited;
    unordered_map<int, int> parent;

    q.push(start);
    visited.insert(start);
    parent[start] = -1;

    while (!q.empty()) {
        int cur = q.front(); q.pop();

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
            if (nxt >= 0 && nxt < n && !visited.count(nxt) && grid[nxt] == 0) {
                visited.insert(nxt);
                parent[nxt] = cur;
                q.push(nxt);
            }
        }
    }
    return {};
}
