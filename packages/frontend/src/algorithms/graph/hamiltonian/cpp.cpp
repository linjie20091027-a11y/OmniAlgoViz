#include <iostream>
#include <vector>
using namespace std;

bool backtrack(int u, vector<int>& path, vector<bool>& visited,
               const vector<vector<int>>& graph) {
    visited[u] = true;
    path.push_back(u);
    if (path.size() == graph.size()) return true;

    for (int v : graph[u]) {
        if (!visited[v]) {
            if (backtrack(v, path, visited, graph)) return true;
        }
    }

    visited[u] = false;
    path.pop_back();
    return false;
}

vector<int> hamiltonianPath(const vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> path;
    for (int start = 0; start < n; start++) {
        vector<bool> visited(n, false);
        path.clear();
        if (backtrack(start, path, visited, graph)) return path;
    }
    return {};
}

int main() {
    vector<vector<int>> graph = {
        {1, 2, 3}, {0, 2, 4}, {0, 1, 3},
        {0, 2, 4}, {1, 3}
    };
    auto result = hamiltonianPath(graph);
    if (result.empty()) {
        cout << "不存在哈密顿路径" << endl;
    } else {
        cout << "哈密顿路径: ";
        for (int v : result) cout << v << " ";
        cout << endl;
    }
    return 0;
}
