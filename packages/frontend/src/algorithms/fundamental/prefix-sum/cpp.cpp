vector<int> prefixSum(vector<int>& arr) {
    int n = arr.size();
    vector<int> pf(n);
    pf[0] = arr[0];
    for (int i = 1; i < n; i++) {
        pf[i] = pf[i - 1] + arr[i];
    }
    return pf;
}

int rangeQuery(vector<int>& pf, int l, int r) {
    if (l == 0) return pf[r];
    return pf[r] - pf[l - 1];
}
