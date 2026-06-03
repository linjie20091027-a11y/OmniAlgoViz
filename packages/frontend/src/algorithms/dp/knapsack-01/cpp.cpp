#include <vector>
#include <algorithm>
using namespace std;

int knapsack01(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

    for (int i = 1; i <= n; i++) {
        int w = weights[i - 1], v = values[i - 1];
        for (int j = 0; j <= capacity; j++) {
            if (j < w)
                dp[i][j] = dp[i - 1][j];
            else
                dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - w] + v);
        }
    }

    return dp[n][capacity];
}
