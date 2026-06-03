#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> eulerPath(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> degree(n);
    for (int i = 0; i < n; i++) degree[i] = graph[i].size();

    int oddCount = 0, start = 0;
    for (int i = 0; i < n; i++) {
        if (degree[i] % 2 != 0) {
            oddCount++;
            start = i;
        }
    }

    if (oddCount > 2) return {};

    vector<int> path, stack = {start};
    while (!stack.empty()) {
        int u = stack.back();
        if (!graph[u].empty()) {
            int v = graph[u].back(); graph[u].pop_back();
            auto it = find(graph[v].begin(), graph[v].end(), u);
            if (it != graph[v].end()) graph[v].erase(it);
            stack.push_back(v);
        } else {
            path.push_back(u);
            stack.pop_back();
        }
    }
    return path;
}

int main() {
    vector<vector<int>> graph = {
        {1, 2, 3}, {0, 2}, {0, 1, 3, 4},
        {0, 2, 4}, {2, 3}
    };
    auto result = eulerPath(graph);
    if (result.empty()) {
        cout << "不存在欧拉路径" << endl;
    } else {
        cout << "欧拉路径/回路: ";
        for (int v : result) cout << v << " ";
        cout << endl;
    }
    return 0;
}
