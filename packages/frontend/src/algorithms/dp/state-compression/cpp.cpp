#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

int tsp(vector<vector<int>>& dist) {
    int n = dist.size();
    int states = 1 << n;
    vector<vector<int>> dp(states, vector<int>(n, INT_MAX / 2));
    dp[1][0] = 0;

    for (int mask = 0; mask < states; mask++) {
        if ((mask & 1) == 0) continue;
        for (int i = 0; i < n; i++) {
            if (!(mask & (1 << i))) continue;
            if (dp[mask][i] == INT_MAX / 2) continue;
            for (int j = 0; j < n; j++) {
                if (mask & (1 << j)) continue;
                int newMask = mask | (1 << j);
                dp[newMask][j] = min(dp[newMask][j],
                                     dp[mask][i] + dist[i][j]);
            }
        }
    }

    int full = (1 << n) - 1;
    int best = INT_MAX / 2;
    for (int i = 1; i < n; i++)
        best = min(best, dp[full][i] + dist[i][0]);

    return best;
}
