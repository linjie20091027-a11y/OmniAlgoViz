#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void strongconnect(int v, const vector<vector<int>>& graph,
                   vector<int>& indices, vector<int>& lowlink,
                   vector<bool>& onStack, vector<int>& stack,
                   int& idx, vector<vector<int>>& sccs) {
    indices[v] = lowlink[v] = idx++;
    stack.push_back(v);
    onStack[v] = true;

    for (int w : graph[v]) {
        if (indices[w] == -1) {
            strongconnect(w, graph, indices, lowlink, onStack, stack, idx, sccs);
            lowlink[v] = min(lowlink[v], lowlink[w]);
        } else if (onStack[w]) {
            lowlink[v] = min(lowlink[v], indices[w]);
        }
    }

    if (lowlink[v] == indices[v]) {
        vector<int> scc;
        int w;
        do {
            w = stack.back(); stack.pop_back();
            onStack[w] = false;
            scc.push_back(w);
        } while (w != v);
        sccs.push_back(scc);
    }
}

vector<vector<int>> tarjanSCC(const vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> indices(n, -1), lowlink(n, -1);
    vector<bool> onStack(n, false);
    vector<int> stack;
    vector<vector<int>> sccs;
    int idx = 0;

    for (int i = 0; i < n; i++)
        if (indices[i] == -1)
            strongconnect(i, graph, indices, lowlink, onStack, stack, idx, sccs);

    return sccs;
}

int main() {
    vector<vector<int>> graph = {
        {1}, {2, 4}, {3, 0}, {5}, {5}, {4}
    };
    auto sccs = tarjanSCC(graph);
    cout << "强连通分量:" << endl;
    for (auto& scc : sccs) {
        for (int v : scc) cout << v << " ";
        cout << endl;
    }
    return 0;
}
