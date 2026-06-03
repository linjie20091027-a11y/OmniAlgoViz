#include <vector>
#include <algorithm>
using namespace std;

int lis(vector<int>& arr) {
    int n = arr.size();
    vector<int> dp(n, 1);
    vector<int> tails;

    for (int i = 0; i < n; i++) {
        auto it = lower_bound(tails.begin(), tails.end(), arr[i]);
        int pos = it - tails.begin();
        if (it == tails.end())
            tails.push_back(arr[i]);
        else
            tails[pos] = arr[i];
        dp[i] = pos + 1;
    }

    return tails.size();
}
