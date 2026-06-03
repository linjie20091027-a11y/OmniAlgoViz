#include <iostream>
#include <vector>
#include <queue>
#include <limits>
#include <algorithm>
using namespace std;

struct Dinic {
    int n;
    vector<vector<int>> capacity, flow;

    Dinic(int n) : n(n), capacity(n, vector<int>(n)),
                   flow(n, vector<int>(n)) {}

    void addEdge(int u, int v, int cap) { capacity[u][v] = cap; }

    vector<int> bfs(int source, int sink) {
        vector<int> level(n, -1);
        level[source] = 0;
        queue<int> q;
        q.push(source);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v = 0; v < n; v++) {
                if (level[v] == -1 && capacity[u][v] - flow[u][v] > 0) {
                    level[v] = level[u] + 1;
                    q.push(v);
                }
            }
        }
        return level;
    }

    int dfs(int u, int sink, int pushed, vector<int>& level,
            vector<int>& ptr) {
        if (u == sink) return pushed;
        for (int& v = ptr[u]; v < n; v++) {
            if (level[v] == level[u] + 1 &&
                capacity[u][v] - flow[u][v] > 0) {
                int tr = min(pushed, capacity[u][v] - flow[u][v]);
                int f = dfs(v, sink, tr, level, ptr);
                if (f > 0) {
                    flow[u][v] += f;
                    flow[v][u] -= f;
                    return f;
                }
            }
        }
        return 0;
    }

    int maxFlow(int source, int sink) {
        int total = 0;
        const int INF = numeric_limits<int>::max();
        while (true) {
            auto level = bfs(source, sink);
            if (level[sink] == -1) break;
            vector<int> ptr(n, 0);
            while (true) {
                int f = dfs(source, sink, INF, level, ptr);
                if (f == 0) break;
                total += f;
            }
        }
        return total;
    }
};

int main() {
    Dinic dinic(6);
    vector<tuple<int,int,int>> edges = {
        {0,1,16},{0,2,13},{1,2,10},{1,3,12},{2,1,4},
        {2,4,14},{3,2,9},{3,5,20},{4,3,7},{4,5,4}
    };
    for (auto [u, v, c] : edges) dinic.addEdge(u, v, c);
    cout << "最大流: " << dinic.maxFlow(0, 5) << endl;
    return 0;
}
