#include <vector>
#include <unordered_set>
using namespace std;

bool dfsHelper(const vector<int>& grid, int cur, int end,
               unordered_set<int>& visited, vector<int>& path) {
    visited.insert(cur);
    path.push_back(cur);

    if (cur == end) return true;

    for (int nxt : {cur + 1, cur - 1}) {
        if (nxt >= 0 && nxt < (int)grid.size() &&
            !visited.count(nxt) && grid[nxt] == 0) {
            if (dfsHelper(grid, nxt, end, visited, path)) return true;
        }
    }

    path.pop_back();
    return false;
}

vector<int> dfsSearch(const vector<int>& grid, int start, int end) {
    unordered_set<int> visited;
    vector<int> path;
    if (dfsHelper(grid, start, end, visited, path)) return path;
    return {};
}
