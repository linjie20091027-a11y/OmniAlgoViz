void countingSort(vector<int>& arr) {
    if (arr.empty()) return;
    int n = arr.size();

    int maxVal = *max_element(arr.begin(), arr.end());
    vector<int> count(maxVal + 1, 0);

    for (int v : arr) count[v]++;

    for (int i = 1; i <= maxVal; i++)
        count[i] += count[i - 1];

    vector<int> output(n);
    for (int i = n - 1; i >= 0; i--) {
        int v = arr[i];
        count[v]--;
        output[count[v]] = v;
    }
    arr = output;
}
