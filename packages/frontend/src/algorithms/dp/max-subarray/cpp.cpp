#include <vector>
#include <algorithm>
using namespace std;

int maxSubarray(vector<int>& arr) {
    int cur = arr[0], best = arr[0];
    for (int i = 1; i < arr.size(); i++) {
        cur = max(arr[i], cur + arr[i]);
        best = max(best, cur);
    }
    return best;
}
