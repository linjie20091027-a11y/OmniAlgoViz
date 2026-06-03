#include <iostream>
#include <vector>
using namespace std;

void dfsVisit(int u, const vector<vector<int>>& graph,
              vector<bool>& visited, vector<int>& order, int& time) {
    visited[u] = true;
    order[u] = time++;
    for (int v : graph[u]) {
        if (!visited[v]) {
            dfsVisit(v, graph, visited, order, time);
        }
    }
}

vector<int> dfs(const vector<vector<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    vector<int> order(n, -1);
    int time = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            dfsVisit(i, graph, visited, order, time);
        }
    }
    return order;
}

int main() {
    vector<vector<int>> graph = {
        {1, 2}, {0, 3, 4}, {0, 4},
        {1, 5}, {1, 2, 5}, {3, 4}
    };
    auto result = dfs(graph);
    cout << "各节点的发现顺序: ";
    for (int o : result) cout << o << " ";
    cout << endl;
    return 0;
}
