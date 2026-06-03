#include <iostream>
#include <vector>
#include <queue>
#include <limits>
using namespace std;

typedef pair<int, int> pii;

pair<vector<tuple<int,int,int>>, int> prim(const vector<vector<pii>>& graph) {
    int n = graph.size();
    const int INF = numeric_limits<int>::max();
    vector<bool> visited(n, false);
    vector<int> key(n, INF), parent(n, -1);
    key[0] = 0;
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, 0});

    while (!pq.empty()) {
        auto [k, u] = pq.top(); pq.pop();
        if (visited[u]) continue;
        visited[u] = true;
        for (auto [v, w] : graph[u]) {
            if (!visited[v] && w < key[v]) {
                key[v] = w;
                parent[v] = u;
                pq.push({w, v});
            }
        }
    }

    vector<tuple<int,int,int>> mst;
    int total = 0;
    for (int v = 0; v < n; v++) {
        if (parent[v] != -1) {
            mst.push_back({parent[v], v, key[v]});
            total += key[v];
        }
    }
    return {mst, total};
}

int main() {
    vector<vector<pii>> graph = {
        {{1,4},{2,3}}, {{0,4},{2,1},{3,2}},
        {{0,3},{1,1},{3,4},{4,3}}, {{1,2},{2,4},{4,2},{5,1}},
        {{2,3},{3,2},{5,6}}, {{3,1},{4,6}}
    };
    auto [mst, weight] = prim(graph);
    cout << "MST 边: ";
    for (auto [u, v, w] : mst)
        cout << "(" << u << "-" << v << ":" << w << ") ";
    cout << "\n总权重: " << weight << endl;
    return 0;
}
