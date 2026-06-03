#include <vector>
#include <unordered_set>
#include <algorithm>
using namespace std;

pair<int, bool> search(const vector<int>& grid, int end,
                       vector<int>& path, int g, int threshold,
                       unordered_set<int>& visited) {
    int node = path.back();
    int f = g + abs(end - node);

    if (f > threshold) return {f, false};
    if (node == end) return {threshold, true};

    int minCost = INT_MAX;
    for (int nxt : {node + 1, node - 1}) {
        if (nxt < 0 || nxt >= (int)grid.size() ||
            grid[nxt] == 1 || visited.count(nxt)) continue;

        visited.insert(nxt);
        path.push_back(nxt);
        auto [cost, found] = search(grid, end, path, g + 1, threshold, visited);
        if (found) return {cost, true};
        minCost = min(minCost, cost);
        path.pop_back();
        visited.erase(nxt);
    }
    return {minCost, false};
}

vector<int> idaStar(const vector<int>& grid, int start, int end) {
    int threshold = abs(end - start);
    vector<int> path = {start};

    while (true) {
        unordered_set<int> visited = {start};
        auto [cost, found] = search(grid, end, path, 0, threshold, visited);
        if (found) return path;
        if (cost == INT_MAX) return {};
        threshold = cost;
    }
}
