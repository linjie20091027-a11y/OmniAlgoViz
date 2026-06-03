#include <iostream>
#include <vector>
#include <queue>
#include <limits>
using namespace std;

typedef pair<int, int> pii;

vector<int> dijkstra(const vector<vector<pii>>& graph, int start) {
    int n = graph.size();
    const int INF = numeric_limits<int>::max();
    vector<int> dist(n, INF);
    vector<bool> visited(n, false);
    dist[start] = 0;
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (visited[u]) continue;
        visited[u] = true;
        for (auto [v, w] : graph[u]) {
            if (!visited[v] && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}

int main() {
    vector<vector<pii>> graph = {
        {{1, 4}, {2, 2}}, {{3, 5}, {2, 1}}, {{4, 3}},
        {{5, 2}}, {{3, 1}, {5, 6}}, {}
    };
    auto result = dijkstra(graph, 0);
    cout << "各节点到源点 0 的最短距离: ";
    for (int d : result) cout << d << " ";
    cout << endl;
    return 0;
}
