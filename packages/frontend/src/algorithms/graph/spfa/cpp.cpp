#include <iostream>
#include <vector>
#include <queue>
#include <limits>
using namespace std;

typedef pair<int, int> pii;

vector<int> spfa(const vector<vector<pii>>& graph, int start) {
    int n = graph.size();
    const int INF = numeric_limits<int>::max();
    vector<int> dist(n, INF);
    vector<bool> inQueue(n, false);
    vector<int> count(n, 0);
    dist[start] = 0;
    queue<int> q;
    q.push(start);
    inQueue[start] = true;

    while (!q.empty()) {
        int u = q.front(); q.pop();
        inQueue[u] = false;
        for (auto [v, w] : graph[u]) {
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (!inQueue[v]) {
                    q.push(v);
                    inQueue[v] = true;
                    if (++count[v] >= n) {
                        cout << "检测到负权环！" << endl;
                        return {};
                    }
                }
            }
        }
    }
    return dist;
}

int main() {
    vector<vector<pii>> graph = {
        {{1,4},{2,2}}, {{3,5},{2,-3}}, {{4,3}},
        {{5,2}}, {{3,-2}}, {}
    };
    auto result = spfa(graph, 0);
    if (!result.empty()) {
        cout << "各节点到源点 0 的最短距离: ";
        for (int d : result) cout << d << " ";
        cout << endl;
    }
    return 0;
}
