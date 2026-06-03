#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

// ---------- Kruskal ----------
struct Edge { int u, v, w; };
class DSU {
    vector<int> parent;
public:
    DSU(int n) : parent(n) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
    bool unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        parent[rx] = ry;
        return true;
    }
};

vector<Edge> kruskal(vector<Edge> edges, int n) {
    sort(edges.begin(), edges.end(),
         [](Edge& a, Edge& b) { return a.w < b.w; });
    DSU dsu(n);
    vector<Edge> mst;
    for (auto& e : edges)
        if (dsu.unite(e.u, e.v)) mst.push_back(e);
    return mst;
}

// ---------- Prim ----------
typedef pair<int, int> pii;

vector<tuple<int,int,int>> prim(const vector<vector<pii>>& adj, int n) {
    const int INF = numeric_limits<int>::max();
    vector<bool> visited(n, false);
    vector<int> key(n, INF);
    key[0] = 0;
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, 0});
    vector<tuple<int,int,int>> mst;

    while (!pq.empty()) {
        auto [k, u] = pq.top(); pq.pop();
        if (visited[u]) continue;
        visited[u] = true;
        for (auto [v, w] : adj[u]) {
            if (!visited[v] && w < key[v]) {
                key[v] = w;
                pq.push({w, v});
                mst.push_back({u, v, w});
            }
        }
    }
    return mst;
}

int main() {
    vector<Edge> edges = {
        {0,1,4},{0,2,3},{1,2,1},{1,3,2},
        {2,3,4},{2,4,3},{3,4,2},{3,5,1},{4,5,6}
    };
    vector<vector<pii>> adj(6);
    for (auto& e : edges) {
        adj[e.u].push_back({e.v, e.w});
        adj[e.v].push_back({e.u, e.w});
    }
    auto k_mst = kruskal(edges, 6);
    auto p_mst = prim(adj, 6);
    cout << "Kruskal MST: ";
    for (auto& e : k_mst) cout << "(" << e.u << "-" << e.v << ") ";
    cout << "\nPrim MST: ";
    for (auto [u, v, w] : p_mst) cout << "(" << u << "-" << v << ") ";
    cout << endl;
    return 0;
}
