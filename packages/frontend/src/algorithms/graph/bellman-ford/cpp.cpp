#include <iostream>
#include <vector>
#include <limits>
using namespace std;

struct Edge { int u, v, w; };

vector<int> bellmanFord(const vector<Edge>& edges, int n, int start) {
    const int INF = numeric_limits<int>::max();
    vector<int> dist(n, INF);
    dist[start] = 0;

    for (int i = 0; i < n - 1; i++) {
        bool relaxed = false;
        for (auto [u, v, w] : edges) {
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                relaxed = true;
            }
        }
        if (!relaxed) break;
    }

    for (auto [u, v, w] : edges) {
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            cout << "检测到负权环！" << endl;
            return {};
        }
    }
    return dist;
}

int main() {
    vector<Edge> edges = {
        {0,1,6},{0,2,7},{1,2,8},{1,3,5},{1,4,-4},
        {2,3,-3},{2,4,9},{3,1,-2},{4,0,2},{4,3,7}
    };
    auto result = bellmanFord(edges, 5, 0);
    if (!result.empty()) {
        cout << "各节点到源点 0 的最短距离: ";
        for (int d : result) cout << d << " ";
        cout << endl;
    }
    return 0;
}
