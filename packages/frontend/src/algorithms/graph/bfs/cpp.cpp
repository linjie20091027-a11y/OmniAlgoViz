#include <iostream>
#include <vector>
#include <queue>
#include <limits>
using namespace std;

vector<int> bfs(const vector<vector<int>>& graph, int start) {
    int n = graph.size();
    vector<bool> visited(n, false);
    vector<int> dist(n, -1);
    dist[start] = 0;
    visited[start] = true;
    queue<int> q;
    q.push(start);

    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : graph[u]) {
            if (!visited[v]) {
                visited[v] = true;
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist;
}

int main() {
    vector<vector<int>> graph = {
        {1, 2}, {0, 3, 4}, {0, 4},
        {1, 5}, {1, 2, 5}, {3, 4}
    };
    auto result = bfs(graph, 0);
    cout << "各节点到源点 0 的最短距离: ";
    for (int d : result) cout << d << " ";
    cout << endl;
    return 0;
}
