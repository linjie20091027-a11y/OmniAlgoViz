#include <iostream>
#include <vector>
using namespace std;

bool dfs(int u, vector<int>& matchR, vector<bool>& visited,
         const vector<vector<int>>& adj) {
    for (int v : adj[u]) {
        if (visited[v]) continue;
        visited[v] = true;
        if (matchR[v] == -1 || dfs(matchR[v], matchR, visited, adj)) {
            matchR[v] = u;
            return true;
        }
    }
    return false;
}

int hungarian(const vector<vector<int>>& adj, int leftSize,
              vector<int>& matchL, vector<int>& matchR) {
    int rightSize = 0;
    for (auto& row : adj)
        for (int v : row) rightSize = max(rightSize, v + 1);

    matchR.assign(rightSize, -1);
    int total = 0;

    for (int u = 0; u < leftSize; u++) {
        vector<bool> visited(rightSize, false);
        if (dfs(u, matchR, visited, adj)) total++;
    }

    matchL.assign(leftSize, -1);
    for (int v = 0; v < rightSize; v++)
        if (matchR[v] != -1) matchL[matchR[v]] = v;

    return total;
}

int main() {
    vector<vector<int>> adj = {{0,1}, {0,2}, {1}, {2,3}};
    vector<int> matchL, matchR;
    int total = hungarian(adj, 4, matchL, matchR);
    cout << "最大匹配数: " << total << endl;
    cout << "左→右匹配: ";
    for (int m : matchL) cout << m << " ";
    cout << "\n右→左匹配: ";
    for (int m : matchR) cout << m << " ";
    cout << endl;
    return 0;
}
