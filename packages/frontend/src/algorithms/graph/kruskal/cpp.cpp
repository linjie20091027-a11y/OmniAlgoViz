#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Edge { int u, v, w; };

class DSU {
    vector<int> parent, rank;
public:
    DSU(int n) : parent(n), rank(n, 0) {
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
        if (rank[rx] < rank[ry]) parent[rx] = ry;
        else if (rank[rx] > rank[ry]) parent[ry] = rx;
        else { parent[ry] = rx; rank[rx]++; }
        return true;
    }
};

pair<vector<Edge>, int> kruskal(vector<Edge> edges, int n) {
    sort(edges.begin(), edges.end(),
         [](Edge& a, Edge& b) { return a.w < b.w; });
    DSU dsu(n);
    vector<Edge> mst;
    int total = 0;
    for (auto& e : edges) {
        if (dsu.unite(e.u, e.v)) {
            mst.push_back(e);
            total += e.w;
            if (mst.size() == n - 1) break;
        }
    }
    return {mst, total};
}

int main() {
    vector<Edge> edges = {
        {0,1,4},{0,2,3},{1,2,1},{1,3,2},
        {2,3,4},{2,4,3},{3,4,2},{3,5,1},{4,5,6}
    };
    auto [mst, weight] = kruskal(edges, 6);
    cout << "MST 边: ";
    for (auto& e : mst) cout << "(" << e.u << "-" << e.v << ":" << e.w << ") ";
    cout << "\n总权重: " << weight << endl;
    return 0;
}
