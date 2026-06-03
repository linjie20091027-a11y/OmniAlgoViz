#include <iostream>
#include <vector>
#include <queue>
using namespace std;

bool isBipartite(const vector<vector<int>>& graph, vector<int>& color) {
    int n = graph.size();
    color.assign(n, -1);

    for (int start = 0; start < n; start++) {
        if (color[start] != -1) continue;
        color[start] = 0;
        queue<int> q;
        q.push(start);

        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : graph[u]) {
                if (color[v] == -1) {
                    color[v] = 1 - color[u];
                    q.push(v);
                } else if (color[v] == color[u]) {
                    return false;
                }
            }
        }
    }
    return true;
}

int main() {
    vector<vector<int>> graph = {
        {3, 4}, {3, 5}, {4},
        {0, 1}, {0, 2, 5}, {1, 4}
    };
    vector<int> color;
    bool bip = isBipartite(graph, color);
    if (bip) {
        cout << "该图是二分图" << endl;
        cout << "染色结果: ";
        for (int c : color) cout << c << " ";
        cout << endl;
    } else {
        cout << "该图不是二分图" << endl;
    }
    return 0;
}
