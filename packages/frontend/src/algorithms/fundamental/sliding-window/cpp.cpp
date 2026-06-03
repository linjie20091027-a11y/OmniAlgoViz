int slidingWindow(vector<int>& arr, int k) {
    int n = arr.size();
    int ws = 0;
    for (int i = 0; i < k; i++) ws += arr[i];
    int mx = ws;
    for (int i = k; i < n; i++) {
        ws = ws - arr[i - k] + arr[i];
        mx = max(mx, ws);
    }
    return mx;
}
