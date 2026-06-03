#include <iostream>
#include <vector>
#include <queue>
using namespace std;

vector<int> topologicalSort(const vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> indegree(n, 0);
    for (int u = 0; u < n; u++)
        for (int v : graph[u]) indegree[v]++;

    queue<int> q;
    for (int i = 0; i < n; i++)
        if (indegree[i] == 0) q.push(i);

    vector<int> result;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        result.push_back(u);
        for (int v : graph[u]) {
            if (--indegree[v] == 0) q.push(v);
        }
    }

    if (result.size() < n) {
        cout << "图中存在环！" << endl;
        return {};
    }
    return result;
}

int main() {
    vector<vector<int>> graph = {
        {1, 2}, {3, 4}, {3}, {5}, {5}, {}
    };
    auto result = topologicalSort(graph);
    if (!result.empty()) {
        cout << "拓扑排序结果: ";
        for (int x : result) cout << x << " ";
        cout << endl;
    }
    return 0;
}
